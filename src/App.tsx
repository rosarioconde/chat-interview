import React, { useEffect, useRef, useState } from "react";

type Message = {
  id: string;
  type: "bot" | "user";
  text: React.ReactNode;
};

const ANSWERS = {
  intro: (
    <p>
      Me llamo Rosario Conde, soy developer, trabajo hace 3 años con react y
      hace 8 años que tengo experiencia en desarrollo
    </p>
  ),
  comunidad: (
    <p>Si necesitas una ayuda para programar o cualquier consulta escribime.</p>
  ),
  unknown: (
    <p>
      Soy una IA preparada para contestar algunas preguntar por favor volve a
      reformular
    </p>
  ),
  contacto: (
    <p>
      Si queres contactarme, podes hacerlo a traves de mi twitter o{" "}
      <a href="https://www.linkedin.com/in/rosario-conde/" target="_blank">
        linkedin
      </a>
      .
    </p>
  ),
};
const EXAMPLES = [
  { text: "hola", label: "intro" },
  { text: "como estas?", label: "intro" },
  { text: "quien sos?", label: "intro" },
  { text: "tengo una duda", label: "comunidad" },
  { text: "necesito solucionar algo", label: "unknown" },
  { text: "estás buscando trabajo?", label: "intro" },
  { text: "con que tecnologias trabajas?", label: "intro" },
  { text: "con que tecnologias tenés experiencia?", label: "intro" },
  { text: "sabes inglés?", label: "intro" },
  { text: "cuantos años de experiencia tenés?", label: "intro" },
  { text: "como es tu Linkedin?", label: "comunidad" },
  { text: "como es tu GitHub?", label: "comunidad" },
  { text: "de donde sos?", label: "intro" },
  { text: "trabajás como freelance?", label: "comunidad" },
  { text: "como hiciste este chat?", label: "comunidad" },
  { text: "te puedo hacer una consulta?", label: "comunidad" },
  { text: "cuales son tus redes?", label: "comunidad" },
  { text: "tenes cv?  ", label: "intro" },
  { text: "que edad tiene tu perro?", label: "unknown" },
  { text: "cual es tu remuneracion salarial?", label: "contacto" },
  { text: "por donde te puedo contactar?", label: "contacto" },
  { text: "en que horario estas disponible? ", label: "contacto" },
];


function App() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "bot",
      text: "hola soy un bot preparado para contestar algunas preguntas",
    },
  ]);
  const [question, setQuestion] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const container = useRef<HTMLDivElement>(null);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (loading) return;

    setLoading(true);
    setMessages((messages) =>
      messages.concat({
        id: String(Date.now()),
        type: "user",
        text: question,
      })
    );
    setQuestion("");

    const { classifications } = await fetch(
      "https://api.cohere.ai/v1/classify",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "large",
          inputs: [question],
          examples: EXAMPLES,
        }),
      }
    ).then((res) => res.json());

    setMessages((messages) =>
      messages.concat({
        id: String(Date.now()),
        type: "bot",
        text:
          ANSWERS[classifications[0].prediction as keyof typeof ANSWERS] ||
          ANSWERS["unknown"],
      })
    );
    setLoading(false);
  }

  useEffect(() => {
    container.current?.scrollTo(0, container.current.scrollHeight);
  }, [messages]);

  return (
    <main className="p-4">
      <div className="flex flex-col gap-4 m-auto max-w-lg border border-gray-400 p-4 rounded-md">
        <div
          ref={container}
          className="flex flex-col gap-4 h-[300px] overflow-y-auto"
        >
          {messages.map((message) => (
            <div
              key={message.id}
              className={`p-4 max-w-[80%] rounded-3xl bg-slate-500 text-white ${
                message.type == "bot"
                  ? "bg-slate-500 text-left self-start rounded-bl-none"
                  : "bg-blue-500 text-right self-end rounded-br-none"
              }`}
            >
              {message.text}
            </div>
          ))}
        </div>
        <form className="flex items-center" onSubmit={handleSubmit}>
          <input
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            placeholder="quien sos?"
            className="rounded rounded-r-none flex-1 border border-gray-400 py-2 px-4"
            type="text"
            name="question"
          />
          <button
            disabled={loading}
            className={`px-4 py-2 bg-blue-500 rounded-lg ${
              loading ? "bg-blue-300 " : "bg-blue-500 "
            }`}
            type="submit"
          >
            Enviar
          </button>
        </form>
      </div>
    </main>
  );
}

export default App;
