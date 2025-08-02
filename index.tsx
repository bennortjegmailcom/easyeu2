import { GoogleGenAI, Type } from "@google/genai";

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        equipmentList: {
            type: Type.ARRAY,
            description: "A list of unique equipment names found in the data.",
            items: { type: Type.STRING }
        },
        systemTypes: {
            type: Type.ARRAY,
            description: "A list of unique system types found in the data.",
            items: { type: Type.STRING }
        },
        faultTypes: {
            type: Type.ARRAY,
            description: "A list of unique fault types found in the data.",
            items: { type: Type.STRING }
        },
        sections: {
            type: Type.ARRAY,
            description: "A list of unique responsible sections found in the data, each with a name and a hex color.",
            items: {
                type: Type.OBJECT,
                properties: {
                    name: { type: Type.STRING },
                    color: { type: Type.STRING, description: "A unique, visually appealing hex color code for the section."}
                },
                required: ["name", "color"]
            }
        },
        equipmentRelations: {
            type: Type.ARRAY,
            description: "The main list of relationships, grouped by equipment and responsible section.",
            items: {
                type: Type.OBJECT,
                properties: {
                    id: { 
                        type: Type.STRING,
                        description: "A unique ID for the relation, typically a timestamp."
                    },
                    equipment: {
                        type: Type.STRING,
                        description: "The slug-cased version of the equipment name (e.g., 'Loader 1' becomes 'loader-1')."
                    },
                    section: {
                        type: Type.STRING,
                        description: "The responsible section for this group of systems/faults."
                    },
                    systems: {
                        type: Type.ARRAY,
                        description: "All systems associated with this equipment and section.",
                        items: { type: Type.STRING }
                    },
                    faults: {
                        type: Type.ARRAY,
                        description: "All faults associated with this equipment and section.",
                        items: { type: Type.STRING }
                    }
                },
                required: ['id', 'equipment', 'section', 'systems', 'faults']
            }
        }
    },
    required: ["equipmentList", "systemTypes", "faultTypes", "sections", "equipmentRelations"]
};

const systemInstruction = `You are an expert data processor for an equipment management application. Your task is to analyze the user-provided text, which is likely copied from a spreadsheet, and convert it into a structured JSON object.

Follow these rules precisely:
1.  **Parse the Data**: The user will provide data that has columns like Equipment, System, Fault, and Section (or similar terms). Identify these distinct entities.
2.  **Generate Master Lists**: Create complete, unique, and sorted lists for 'equipmentList', 'systemTypes', 'faultTypes'.
3.  **Generate Sections List**: Create a list of 'sections', where each section is an object with a 'name' and a unique, visually distinct hex 'color'.
4.  **Group Relations**: The most important task is to create the 'equipmentRelations' array. Group the data by each unique combination of an equipment item and a responsible section. For each group, collect all associated systems and faults into their respective arrays.
5.  **Slugs for Equipment**: In the 'equipmentRelations', the 'equipment' field MUST be a "slug-cased" version of the name from the 'equipmentList' (e.g., "Haul Truck 05" becomes "haul-truck-05").
6.  **Unique IDs**: Each object in 'equipmentRelations' must have a unique 'id'. Use the current timestamp as a string, incrementing it slightly for each relation to ensure uniqueness.
7.  **Output**: Return only the final, valid JSON object that strictly conforms to the provided schema. Do not include any extra text, explanations, or markdown formatting.`;


export async function generateJsonFromText(text) {
    // Defer API key check and client initialization until the function is actually called.
    // This prevents the entire application from crashing if the API key is not set.
    if (!process.env.API_KEY) {
        throw new Error("API_KEY environment variable not set. Please configure it to use the AI Compiler.");
    }
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: text,
            config: {
                responseMimeType: "application/json",
                responseSchema: responseSchema,
                systemInstruction: systemInstruction,
            },
        });
        
        const jsonString = response.text.trim();
        // The response text should be a valid JSON string because of the schema.
        return JSON.parse(jsonString);

    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw new Error("The AI failed to generate a valid JSON response. Please check the format of your input data or try again.");
    }
}