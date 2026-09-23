/* =========================================================
   WHITETIGER.DEV
   JavaScript
   ========================================================= */


/* =========================
   1. HEADER AU SCROLL
   ========================= */

const header = document.querySelector(".header");

if (header) {
    window.addEventListener("scroll", () => {
        if (window.scrollY > 50) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }
    });
}


/* =========================
   1bis. BOUTON RETOUR EN HAUT
   ========================= */

const backToTop = document.getElementById("back-to-top");

if (backToTop) {

    window.addEventListener("scroll", () => {
        if (window.scrollY > 500) {
            backToTop.classList.add("visible");
        } else {
            backToTop.classList.remove("visible");
        }
    });

    backToTop.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });

}


/* =========================
   2. MENU MOBILE
   ========================= */

const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");

if (menuToggle && navLinks) {

    menuToggle.addEventListener("click", () => {
        navLinks.classList.toggle("active");
    });

}


/* =========================
   3. FERMER LE MENU
   ========================= */

const navigationLinks = document.querySelectorAll(".nav-links a");

navigationLinks.forEach((link) => {

    link.addEventListener("click", () => {

        if (navLinks) {
            navLinks.classList.remove("active");
        }

    });

});


/* =========================
   3bis. FORMULAIRE DE CONTACT
   ========================= */

const contactForm = document.getElementById("contact-form");
const formStatus = document.getElementById("form-status");

if (contactForm && formStatus) {

    contactForm.addEventListener("submit", async (event) => {

        event.preventDefault();

        const boutonEnvoyer =
            contactForm.querySelector("button[type='submit']");

        if (!boutonEnvoyer) {
            console.error("Bouton d'envoi introuvable.");
            return;
        }

        /* État pendant l'envoi */

        boutonEnvoyer.disabled = true;
        boutonEnvoyer.textContent = "Envoi...";

        formStatus.textContent = "Envoi en cours...";
        formStatus.className = "form-status";

        try {

            /* Récupérer les données du formulaire */

            const donnees = new FormData(contactForm);

            /* Envoyer vers Formspree */

            const reponse = await fetch(
                contactForm.action,
                {
                    method: "POST",
                    body: donnees,
                    headers: {
                        "Accept": "application/json"
                    }
                }
            );


            /* =========================
               ENVOI RÉUSSI
               ========================= */

            if (reponse.ok) {

                formStatus.textContent =
                    "Message envoyé avec succès ! Je vous répondrai rapidement.";

                formStatus.className =
                    "form-status form-status-success";

                contactForm.reset();

            }


            /* =========================
               ERREUR FORMSPREE
               ========================= */

            else {

                let messageErreur =
                    "Le message n'a pas pu être envoyé. Réessayez.";

                try {

                    const data = await reponse.json();

                    if (data.errors && data.errors.length > 0) {

                        messageErreur =
                            data.errors
                                .map((erreur) => erreur.message)
                                .join(", ");

                    }

                } catch (erreurJSON) {

                    console.warn(
                        "Impossible de lire la réponse Formspree.",
                        erreurJSON
                    );

                }

                formStatus.textContent =
                    messageErreur;

                formStatus.className =
                    "form-status form-status-error";

            }

        } catch (erreur) {

            console.error(
                "Erreur Formspree :",
                erreur
            );

            formStatus.textContent =
                "Erreur de connexion. Réessayez ou écrivez-moi directement par e-mail.";

            formStatus.className =
                "form-status form-status-error";

        } finally {

            /* Réactiver le bouton */

            boutonEnvoyer.disabled = false;
            boutonEnvoyer.textContent = "Envoyer le message";

        }

    });

}


/* ================================
   4. ASSISTANT IA
   ================================ */

const aiButton = document.getElementById("ai-button");
const aiChat = document.getElementById("ai-chat");
const aiClose = document.getElementById("ai-close");

const aiInput = document.getElementById("ai-input");
const aiSend = document.getElementById("ai-send");
const aiMessages = document.getElementById("ai-messages");


/* ================================
   4bis. URL DU SERVEUR IA
   ================================

   En local :
   http://127.0.0.1:3000/chat

   Après déploiement :
   remplacer l'URL ci-dessous par l'URL Render.

   Exemple :
   https://whitetiger-ai.onrender.com/chat

   IMPORTANT :
   La clé GROQ_API_KEY ne doit jamais apparaître ici.
   ================================ */

const AI_SERVER_URL =
    (window.location.hostname === "localhost" ||
     window.location.hostname === "127.0.0.1")
        ? "http://127.0.0.1:3000/chat"
        : "https://TON-SERVEUR-DEPLOYE.exemple.com/chat";


/* ================================
   5. OUVRIR L'ASSISTANT
   ================================ */

if (aiButton && aiChat && aiInput) {

    aiButton.addEventListener("click", () => {

        aiChat.classList.remove("ai-chat-hidden");

        aiInput.focus();

    });

}


/* ================================
   6. FERMER L'ASSISTANT
   ================================ */

if (aiClose && aiChat) {

    aiClose.addEventListener("click", () => {

        aiChat.classList.add("ai-chat-hidden");

    });

}


/* ================================
   7. AJOUTER UN MESSAGE
   ================================ */

function ajouterMessage(message, classe) {

    const nouveauMessage =
        document.createElement("div");

    nouveauMessage.classList.add(classe);

    nouveauMessage.textContent = message;

    aiMessages.appendChild(nouveauMessage);

    aiMessages.scrollTop =
        aiMessages.scrollHeight;

}


/* ================================
   8. ENVOYER LE MESSAGE À L'IA
   ================================ */

if (aiSend && aiInput && aiMessages) {

    aiSend.addEventListener("click", async () => {

        console.log(
            "LE BOUTON ENVOYER EST CLIQUÉ"
        );


        const messageUtilisateur =
            aiInput.value.trim();


        /* Ne rien envoyer si vide */

        if (messageUtilisateur === "") {
            return;
        }


        /* Afficher le message utilisateur */

        ajouterMessage(
            messageUtilisateur,
            "user-message"
        );


        /* Vider le champ */

        aiInput.value = "";


        /* Désactiver le bouton */

        aiSend.disabled = true;


        /* Message temporaire */

        ajouterMessage(
            "Je réfléchis... 🤖",
            "ai-message"
        );


        try {

            const response = await fetch(
                AI_SERVER_URL,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        message:
                            messageUtilisateur
                    })
                }
            );


            /* Vérifier la réponse HTTP */

            if (!response.ok) {

                throw new Error(
                    "Erreur HTTP : " +
                    response.status
                );

            }


            /* Convertir la réponse en JSON */

            const data =
                await response.json();


            /* Supprimer "Je réfléchis..." */

            const messagesIA =
                aiMessages.querySelectorAll(
                    ".ai-message"
                );


            if (messagesIA.length > 1) {

                messagesIA[
                    messagesIA.length - 1
                ].remove();

            }


            /* Afficher la réponse de l'IA */

            ajouterMessage(
                data.reponse ||
                "Je n'ai pas reçu de réponse.",
                "ai-message"
            );


        } catch (error) {

            console.error(
                "Erreur assistant IA :",
                error
            );


            /* Supprimer le message temporaire */

            const messagesIA =
                aiMessages.querySelectorAll(
                    ".ai-message"
                );


            if (messagesIA.length > 1) {

                messagesIA[
                    messagesIA.length - 1
                ].remove();

            }


            /* Afficher l'erreur */

            ajouterMessage(
                "Désolé, je n'arrive pas à contacter le serveur 🤖.",
                "ai-message"
            );

        }


        /* Réactiver le bouton */

        aiSend.disabled = false;

        aiInput.focus();

    });


    /* ================================
       9. TOUCHE ENTRÉE
       ================================ */

    aiInput.addEventListener(
        "keydown",
        (event) => {

            if (event.key === "Enter") {

                event.preventDefault();

                aiSend.click();

            }

        }
    );

}