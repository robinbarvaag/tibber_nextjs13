import type { NextApiRequest, NextApiResponse } from "next";
const { Configuration, OpenAIApi } = require("openai");

const OPENAI_API_KEY: string = process.env.OPENAI_API_KEY ?? "";

export default async function index(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  try {
    const configuration = new Configuration({
      apiKey: OPENAI_API_KEY,
    });

    const openai = new OpenAIApi(configuration);

    // const prompt =
    //   "Dyrkesone 4 med mye sol og sør-østvendt dyrking. Hvilke grønnsaker og planter bør jeg dyrke?";

    const completion = await openai.createCompletion({
      model: "text-davinci-001",
      prompt:
        "Du er en ekspert på grønnsaker og planter, det er viktig at du også spesifiserer dyrkesone, og solforhold i svaret ditt, Dyrkesone 1 med lite sol, retning sør-øst. Hvilke grønnsaker og planter bør jeg dyrke?",
      max_tokens: 200,
    });
    console.log(completion.data);

    //prompt
    //answear It's basically on 67th position according to foreign tourists.

    return res.status(200).json(completion.data.choices[0].text);
  } catch (error) {
    return res.status(200).json(error);
  }
}
