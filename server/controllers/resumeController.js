import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// The JSON schema remains the same, as it defines our desired output structure.
const resumeSchema = {
  type: "OBJECT",
  properties: {
    name: { type: "STRING" },
    email: { type: "STRING" },
    phone: { type: "STRING" },
    linkedin: { type: "STRING" },
    github: { type: "STRING" },
    education: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          degree: { type: "STRING" },
          institution: { type: "STRING" },
          date: { type: "STRING" },
          location: { type: "STRING" },
        },
        required: ["degree", "institution", "date", "location"],
      },
    },
    experience: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          title: { type: "STRING" },
          company: { type: "STRING" },
          date: { type: "STRING" },
          location: { type: "STRING" },
          description: { type: "ARRAY", items: { type: "STRING" } },
        },
        required: ["title", "company", "date", "location", "description"],
      },
    },
    projects: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          name: { type: "STRING" },
          tech: { type: "STRING" },
          date: { type: "STRING" },
          description: { type: "ARRAY", items: { type: "STRING" } },
        },
        required: ["name", "tech", "date", "description"],
      },
    },
    skills: {
      type: "OBJECT",
      properties: {
        languages: { type: "STRING" },
        frameworks: { type: "STRING" },
        tools: { type: "STRING" },
      },
      required: ["languages", "frameworks", "tools"],
    },
  },
  required: ["name", "email", "phone", "linkedin", "github", "education", "experience", "projects", "skills"],
};


const generateResume = async (req, res) => {
  // FIX: Destructure the 'details' field from the request body.
  const { details } = req.body;
  if (!details) {
      return res.status(400).json({ error: 'No details provided in the request.' });
  }

  console.log("Generating structured resume from dynamic form data...");

  // FIX: The prompt now uses the 'details' variable, which contains all the
  // formatted information from the frontend's dynamic form.
  const prompt = `
    Based on the following details, generate a professional resume.
    Parse the details and structure them into the required JSON format.
    For descriptions in experience and projects, create a list of bullet points.
    For skills, categorize them based on the input.

    ${details}
  `;

  try {
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash-latest',
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: resumeSchema,
      },
    });

    const result = await model.generateContent(prompt);
    const generatedText = result.response.text();
    const generatedJson = JSON.parse(generatedText);

    res.status(200).json({ resume: generatedJson });

  } catch (err) {
    console.error('Error generating structured resume:', err);
    res.status(500).json({ error: 'Failed to generate structured resume.' });
  }
};

export { generateResume };
