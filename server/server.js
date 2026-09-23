require("dotenv").config();

const http = require("http");
const https = require("https");

// ==========================================
// RÉCUPÉRER LA CLÉ API GROQ
// ==========================================

const API_KEY = process.env.GROQ_API_KEY;

if (!API_KEY) {
    console.error("ERREUR : GROQ_API_KEY est introuvable.");
    process.exit(1);
}

console.log("Clé Groq détectée.");

// ==========================================
// CONFIGURATION
// ==========================================

const PORT = process.env.PORT || 3000;

const ORIGINE_AUTORISEE =
    process.env.ALLOWED_ORIGIN || "*";

// ==========================================
// SERVEUR
// ==========================================

const server = http.createServer((req, res) => {

    // ======================================
    // CORS
    // ======================================

    res.setHeader(
        "Access-Control-Allow-Origin",
        ORIGINE_AUTORISEE
    );

    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, OPTIONS"
    );

    res.setHeader(
        "Access-Control-Allow-Headers",
        "Content-Type"
    );

    // ======================================
    // REQUÊTE OPTIONS
    // ======================================

    if (req.method === "OPTIONS") {
        res.writeHead(204);
        res.end();
        return;
    }

    // ======================================
    // ROUTE /chat
    // ======================================

    if (req.method === "POST" && req.url === "/chat") {

        console.log("REQUÊTE /chat REÇUE");

        let body = "";

        req.on("data", (chunk) => {
            body += chunk;
        });

        req.on("end", () => {

            try {

                const donnees = JSON.parse(body);

                const messageUtilisateur = donnees.message;

                console.log(
                    "Question reçue :",
                    messageUtilisateur
                );

                // ==================================
                // VÉRIFICATION DU MESSAGE
                // ==================================

                if (
                    !messageUtilisateur ||
                    typeof messageUtilisateur !== "string"
                ) {

                    res.writeHead(400, {
                        "Content-Type":
                            "application/json; charset=utf-8"
                    });

                    res.end(JSON.stringify({
                        reponse: "Message invalide."
                    }));

                    return;
                }

                console.log(
                    "ÉTAPE 1 : préparation de la requête Groq"
                );

                // ==================================
                // DONNÉES ENVOYÉES À GROQ
                // ==================================

                const donneesIA = JSON.stringify({

                    model: "openai/gpt-oss-20b",

                    messages: [

                        {
                            role: "system",

                            content:
                                "Tu es l'assistant officiel du portfolio Whitetiger.dev de Yao Madjoulba Israël MALEDINA. " +
                                "Tu réponds toujours en français, de manière professionnelle, naturelle, claire et concise. " +
                                "Tu peux présenter Yao, son parcours, ses compétences, ses projets et sa formation. " +
                                "Yao est développeur Web & Mobile en formation. " +
                                "Il développe ses compétences en HTML, CSS, JavaScript, communication digitale et marketing digital. " +
                                "Il suit le programme D-CLIC de l'OIF. " +
                                "Il travaille également sur des projets liés à l'intelligence artificielle, au développement web et mobile. " +
                                "Si une question est complètement hors sujet, indique poliment que tu es principalement dédié au portfolio de Yao."
                        },

                        {
                            role: "user",

                            content: messageUtilisateur
                        }

                    ]

                });

                console.log(
                    "ÉTAPE 2 : connexion à Groq..."
                );

                // ==================================
                // CONFIGURATION DE LA REQUÊTE GROQ
                // ==================================

                const options = {

                    hostname: "api.groq.com",

                    path:
                        "/openai/v1/chat/completions",

                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/json",

                        "Authorization":
                            `Bearer ${API_KEY}`,

                        "Content-Length":
                            Buffer.byteLength(donneesIA)

                    }

                };

                // ==================================
                // APPEL GROQ
                // ==================================

                const requeteIA = https.request(

                    options,

                    (reponseIA) => {

                        console.log(
                            "Réponse reçue de l'API Groq :",
                            reponseIA.statusCode
                        );

                        let resultat = "";

                        reponseIA.on(
                            "data",
                            (chunk) => {
                                resultat += chunk;
                            }
                        );

                        reponseIA.on(
                            "end",
                            () => {

                                try {

                                    const donneesReponse =
                                        JSON.parse(resultat);

                                    // ==========================
                                    // ERREUR GROQ
                                    // ==========================

                                    if (donneesReponse.error) {

                                        console.error(
                                            "Erreur Groq :",
                                            donneesReponse.error.message
                                        );

                                        res.writeHead(500, {

                                            "Content-Type":
                                                "application/json; charset=utf-8"

                                        });

                                        res.end(
                                            JSON.stringify({

                                                reponse:
                                                    "L'assistant IA a rencontré une erreur."

                                            })
                                        );

                                        return;
                                    }

                                    // ==========================
                                    // RÉCUPÉRER LE TEXTE
                                    // ==========================

                                    let texte = "";

                                    if (
                                        donneesReponse.choices &&
                                        donneesReponse.choices[0] &&
                                        donneesReponse.choices[0].message
                                    ) {

                                        texte =
                                            donneesReponse
                                                .choices[0]
                                                .message
                                                .content || "";

                                    }

                                    texte = texte.trim();

                                    if (!texte) {

                                        texte =
                                            "Je n'ai pas pu générer une réponse.";

                                    }

                                    console.log(
                                        "Réponse IA :",
                                        texte
                                    );

                                    // ==========================
                                    // RÉPONSE AU PORTFOLIO
                                    // ==========================

                                    res.writeHead(200, {

                                        "Content-Type":
                                            "application/json; charset=utf-8"

                                    });

                                    res.end(
                                        JSON.stringify({

                                            reponse: texte

                                        })
                                    );

                                } catch (erreur) {

                                    console.error(
                                        "Erreur lors du traitement de la réponse :",
                                        erreur.message
                                    );

                                    res.writeHead(500, {

                                        "Content-Type":
                                            "application/json; charset=utf-8"

                                    });

                                    res.end(
                                        JSON.stringify({

                                            reponse:
                                                "Erreur lors du traitement de la réponse de l'IA."

                                        })
                                    );
                                }
                            }
                        );
                    }
                );

                // ==================================
                // ERREUR DE CONNEXION À GROQ
                // ==================================

                requeteIA.on(
                    "error",
                    (erreur) => {

                        console.error(
                            "Erreur de connexion à Groq :",
                            erreur.message
                        );

                        res.writeHead(500, {

                            "Content-Type":
                                "application/json; charset=utf-8"

                        });

                        res.end(
                            JSON.stringify({

                                reponse:
                                    "Impossible de contacter l'intelligence artificielle."

                            })
                        );
                    }
                );

                // ==================================
                // ENVOYER LA REQUÊTE
                // ==================================

                requeteIA.write(donneesIA);

                requeteIA.end();

            } catch (erreur) {

                console.error(
                    "Erreur serveur :",
                    erreur.message
                );

                res.writeHead(400, {

                    "Content-Type":
                        "application/json; charset=utf-8"

                });

                res.end(
                    JSON.stringify({

                        reponse:
                            "Message invalide."

                    })
                );
            }
        });

        return;
    }

    // ======================================
    // ROUTE DE TEST
    // ======================================

    res.writeHead(200, {

        "Content-Type":
            "text/plain; charset=utf-8"

    });

    res.end(
        "Serveur Whitetiger.dev fonctionne !"
    );
});

// ==========================================
// DÉMARRAGE DU SERVEUR
// ==========================================

server.listen(PORT, () => {

    console.log(
        `Serveur Whitetiger.dev démarré sur le port ${PORT}`
    );

});