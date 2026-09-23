/* =========================================================
   WHITETIGER.DEV
   JavaScript principal
   ========================================================= */


/* =========================================================
   1. HEADER AU SCROLL
   ========================================================= */

const header = document.querySelector(".header");

if (header) {

    const gererHeader = () => {

        if (window.scrollY > 50) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }

    };

    window.addEventListener("scroll", gererHeader);

    gererHeader();
}


/* =========================================================
   2. BOUTON RETOUR EN HAUT
   ========================================================= */

const backToTop =
    document.getElementById("back-to-top");

if (backToTop) {

    const gererBackToTop = () => {

        if (window.scrollY > 500) {
            backToTop.classList.add("visible");
        } else {
            backToTop.classList.remove("visible");
        }

    };

    window.addEventListener(
        "scroll",
        gererBackToTop
    );

    gererBackToTop();

    backToTop.addEventListener(
        "click",
        () => {

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        }
    );
}


/* =========================================================
   3. MENU MOBILE
   ========================================================= */

const menuToggle =
    document.querySelector(".menu-toggle");

const navLinks =
    document.querySelector(".nav-links");

if (menuToggle && navLinks) {

    menuToggle.addEventListener(
        "click",
        () => {

            navLinks.classList.toggle("active");

        }
    );
}


/* =========================================================
   4. FERMER LE MENU APRÈS CLIC
   ========================================================= */

const navigationLinks =
    document.querySelectorAll(".nav-links a");

navigationLinks.forEach((link) => {

    link.addEventListener(
        "click",
        () => {

            if (navLinks) {
                navLinks.classList.remove("active");
            }

        }
    );

});


/* =========================================================
   5. FORMULAIRE DE CONTACT
   ========================================================= */

const contactForm =
    document.getElementById("contact-form");

const formStatus =
    document.getElementById("form-status");

if (contactForm && formStatus) {

    contactForm.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();

            const boutonEnvoyer =
                contactForm.querySelector(
                    "button[type='submit']"
                );

            if (!boutonEnvoyer) {

                console.error(
                    "Bouton d'envoi introuvable."
                );

                return;
            }

            boutonEnvoyer.disabled = true;

            boutonEnvoyer.textContent =
                "Envoi...";

            formStatus.textContent =
                "Envoi en cours...";

            formStatus.className =
                "form-status";

            try {

                const donnees =
                    new FormData(contactForm);

                const response =
                    await fetch(
                        contactForm.action,
                        {
                            method: "POST",
                            body: donnees,
                            headers: {
                                Accept:
                                    "application/json"
                            }
                        }
                    );

                if (response.ok) {

                    formStatus.textContent =
                        "Message envoyé avec succès ! Je vous répondrai rapidement.";

                    formStatus.className =
                        "form-status form-status-success";

                    contactForm.reset();

                } else {

                    let messageErreur =
                        "Le message n'a pas pu être envoyé. Réessayez.";

                    try {

                        const data =
                            await response.json();

                        if (
                            data.errors &&
                            Array.isArray(data.errors) &&
                            data.errors.length > 0
                        ) {

                            messageErreur =
                                data.errors
                                    .map(
                                        (erreur) =>
                                            erreur.message
                                    )
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

            } catch (error) {

                console.error(
                    "Erreur formulaire de contact :",
                    error
                );

                formStatus.textContent =
                    "Erreur de connexion. Réessayez ou écrivez-moi directement par e-mail.";

                formStatus.className =
                    "form-status form-status-error";

            } finally {

                boutonEnvoyer.disabled = false;

                boutonEnvoyer.textContent =
                    "Envoyer le message";

            }

        }
    );
}


/* =========================================================
   6. ASSISTANT IA
   ========================================================= */

const aiButton =
    document.getElementById("ai-button");

const aiChat =
    document.getElementById("ai-chat");

const aiClose =
    document.getElementById("ai-close");

const aiInput =
    document.getElementById("ai-input");

const aiSend =
    document.getElementById("ai-send");

const aiMessages =
    document.getElementById("ai-messages");


/* =========================================================
   7. SERVEUR IA
   ========================================================= */

const AI_SERVER_URL =
    "https://whitetiger-api.onrender.com/chat";


/* =========================================================
   8. ÉTAT DE L'ASSISTANT
   ========================================================= */

let aiOuvert = false;


/* =========================================================
   9. OUVRIR L'ASSISTANT
   ========================================================= */

function ouvrirAssistant() {

    if (!aiChat) {
        return;
    }

    aiChat.classList.remove(
        "ai-chat-hidden"
    );

    aiOuvert = true;

    /*
     * Empêche le bouton IA d'être
     * utilisé comme élément de sortie
     * lorsque la fenêtre est ouverte.
     */

    if (aiButton) {
        aiButton.setAttribute(
            "aria-expanded",
            "true"
        );
    }

    /*
     * Focus après affichage.
     * Le délai évite les problèmes
     * sur certains téléphones.
     */

    if (aiInput) {

        setTimeout(
            () => {

                if (aiOuvert) {
                    aiInput.focus();
                }

            },
            150
        );
    }
}


/* =========================================================
   10. FERMER L'ASSISTANT
   ========================================================= */

function fermerAssistant() {

    if (!aiChat) {
        return;
    }

    /*
     * Ferme complètement la fenêtre.
     */

    aiChat.classList.add(
        "ai-chat-hidden"
    );

    aiOuvert = false;

    /*
     * Réinitialise l'état ARIA.
     */

    if (aiButton) {
        aiButton.setAttribute(
            "aria-expanded",
            "false"
        );
    }

    /*
     * Retire le focus du champ.
     * Important sur mobile pour éviter
     * que le clavier reste affiché.
     */

    if (
        document.activeElement === aiInput &&
        aiInput
    ) {

        aiInput.blur();

    }
}


/* =========================================================
   11. BOUTON OUVRIR
   ========================================================= */

if (aiButton && aiChat) {

    aiButton.addEventListener(
        "click",
        (event) => {

            event.preventDefault();

            event.stopPropagation();

            if (aiOuvert) {
                fermerAssistant();
            } else {
                ouvrirAssistant();
            }

        }
    );

}


/* =========================================================
   12. BOUTON X
   ========================================================= */

if (aiClose && aiChat) {

    aiClose.addEventListener(
        "click",
        (event) => {

            /*
             * Empêche le clic de remonter
             * vers d'autres éléments.
             */

            event.preventDefault();

            event.stopPropagation();

            fermerAssistant();

        }
    );

}


/* =========================================================
   13. CONVERTIR LE MARKDOWN SIMPLE
   ========================================================= */

function convertirMarkdownSimple(texte) {

    if (!texte) {
        return "";
    }

    let contenu =
        String(texte);

    /* Sécurisation HTML */

    contenu = contenu
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

    /* Gras */

    contenu = contenu.replace(
        /\*\*(.*?)\*\*/g,
        "<strong>$1</strong>"
    );

    /* Italique */

    contenu = contenu.replace(
        /(^|[^*])\*([^*\n]+)\*(?!\*)/g,
        "$1<em>$2</em>"
    );

    /* Listes */

    contenu = contenu.replace(
        /^\s*[-•]\s+(.+)$/gm,
        "<li>$1</li>"
    );

    /* Regrouper les listes */

    contenu = contenu.replace(
        /((?:<li>.*?<\/li>\s*)+)/gs,
        "<ul>$1</ul>"
    );

    /* Retours à la ligne */

    contenu = contenu.replace(
        /\n/g,
        "<br>"
    );

    return contenu;
}


/* =========================================================
   14. AJOUTER UN MESSAGE
   ========================================================= */

function ajouterMessage(
    message,
    classe
) {

    if (!aiMessages) {
        return null;
    }

    const nouveauMessage =
        document.createElement("div");

    nouveauMessage.classList.add(
        classe
    );

    if (classe === "user-message") {

        nouveauMessage.textContent =
            message;

    } else {

        nouveauMessage.innerHTML =
            convertirMarkdownSimple(
                message
            );

    }

    aiMessages.appendChild(
        nouveauMessage
    );

    /*
     * Faire défiler uniquement
     * la zone de conversation.
     */

    requestAnimationFrame(
        () => {

            aiMessages.scrollTop =
                aiMessages.scrollHeight;

        }
    );

    return nouveauMessage;
}


/* =========================================================
   15. SUPPRIMER LE CHARGEMENT
   ========================================================= */

function supprimerMessageChargement(
    messageElement
) {

    if (
        messageElement &&
        messageElement.parentNode
    ) {

        messageElement.remove();

    }

}


/* =========================================================
   16. ENVOYER LE MESSAGE À L'IA
   ========================================================= */

async function envoyerMessageIA() {

    if (
        !aiInput ||
        !aiSend ||
        !aiMessages
    ) {
        return;
    }

    const messageUtilisateur =
        aiInput.value.trim();

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

    /* Message de chargement */

    const messageChargement =
        ajouterMessage(
            "Je réfléchis...",
            "ai-message"
        );

    try {

        console.log(
            "Connexion au serveur Render..."
        );

        console.log(
            "URL utilisée :",
            AI_SERVER_URL
        );

        const response =
            await fetch(
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

        console.log(
            "Réponse Render :",
            response.status
        );

        if (!response.ok) {

            let detailsErreur =
                `Erreur serveur (${response.status})`;

            try {

                const erreurData =
                    await response.json();

                if (erreurData.message) {

                    detailsErreur =
                        erreurData.message;

                } else if (
                    erreurData.error
                ) {

                    detailsErreur =
                        erreurData.error;

                }

            } catch (erreurJSON) {

                console.warn(
                    "Réponse d'erreur non JSON.",
                    erreurJSON
                );

            }

            throw new Error(
                detailsErreur
            );
        }

        const data =
            await response.json();

        console.log(
            "Réponse reçue depuis Render :",
            data
        );

        supprimerMessageChargement(
            messageChargement
        );

        const reponseIA =
            data.reponse ||
            data.response ||
            data.message ||
            data.answer;

        if (!reponseIA) {

            ajouterMessage(
                "Le serveur a répondu, mais aucune réponse IA n'a été reçue.",
                "ai-message"
            );

        } else {

            ajouterMessage(
                reponseIA,
                "ai-message"
            );

        }

    } catch (error) {

        console.error(
            "Erreur assistant IA :",
            error
        );

        supprimerMessageChargement(
            messageChargement
        );

        ajouterMessage(
            "Désolé, je n'arrive pas à contacter le serveur IA. Vérifiez la connexion au serveur.",
            "ai-message"
        );

    } finally {

        aiSend.disabled = false;

        if (
            aiInput &&
            aiOuvert
        ) {

            aiInput.focus();

        }

    }

}


/* =========================================================
   17. BOUTON ENVOYER
   ========================================================= */

if (aiSend) {

    aiSend.addEventListener(
        "click",
        (event) => {

            event.preventDefault();

            envoyerMessageIA();

        }
    );

}


/* =========================================================
   18. TOUCHE ENTRÉE
   ========================================================= */

if (aiInput) {

    aiInput.addEventListener(
        "keydown",
        (event) => {

            if (
                event.key === "Enter" &&
                !event.shiftKey
            ) {

                event.preventDefault();

                envoyerMessageIA();

            }

        }
    );

}


/* =========================================================
   19. TOUCHE ÉCHAP
   ========================================================= */

document.addEventListener(
    "keydown",
    (event) => {

        if (
            event.key === "Escape" &&
            aiOuvert
        ) {

            fermerAssistant();

        }

    }
);


/* =========================================================
   20. MESSAGE DE BIENVENUE
   ========================================================= */

if (
    aiMessages &&
    aiMessages.children.length === 0
) {
s
    ajouterMessage(
        "Bonjour 👋 Je suis l'assistant IA de Whitetiger.dev. Que souhaitez-vous savoir sur le portfolio, les projets ou le parcours de MALEDINA ?",
        "ai-message"
    );

}


/* =========================================================
   FIN DU SCRIPT
   ========================================================= */