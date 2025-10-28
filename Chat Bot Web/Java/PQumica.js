
document.getElementById('chatBotBtn').addEventListener('click', () => {
    // Toggle the in-page chat popup
    const existing = document.querySelector('.chat-popup');
    if (existing) {
        // if hidden, show; if shown, remove
        if (existing.classList.contains('hidden')) {
            existing.classList.remove('hidden');
        } else {
            existing.classList.add('hidden');
        }
        return;
    }

    // Create chat popup elements
    const popup = document.createElement('div');
    popup.className = 'chat-popup';
    popup.innerHTML = `
        <div class="chat-window" role="dialog" aria-label="Chat bot">
            <div class="chat-header">
                <strong>Chat Bot</strong>
                <button class="chat-close" aria-label="Cerrar chat">×</button>
            </div>
            <div class="chat-messages" aria-live="polite"></div>
            <div class="chat-input-area">
                <input class="chat-input" type="text" placeholder="Escribe un mensaje..." aria-label="Mensaje">
                <button class="chat-send-btn">Enviar</button>
            </div>
        </div>
    `;

    document.body.appendChild(popup);

    const closeBtn = popup.querySelector('.chat-close');
    const sendBtn = popup.querySelector('.chat-send-btn');
    const input = popup.querySelector('.chat-input');
    const messages = popup.querySelector('.chat-messages');

    function appendMessage(text, who = 'user') {
        const msg = document.createElement('div');
        msg.className = 'chat-msg ' + (who === 'user' ? 'chat-user' : 'chat-bot');
        msg.textContent = text;
        messages.appendChild(msg);
        messages.scrollTop = messages.scrollHeight;
    }

    function botReply(userText) {
        // Simple simulated reply; can be enhanced to call an API later
        const reply = `Respuesta automática: ${userText}`;
        setTimeout(() => appendMessage(reply, 'bot'), 700);
    }

    sendBtn.addEventListener('click', () => {
        const text = input.value.trim();
        if (!text) return;
        appendMessage(text, 'user');
        input.value = '';
        botReply(text);
    });

    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            sendBtn.click();
        }
    });

    closeBtn.addEventListener('click', () => {
        popup.classList.add('hidden');
    });

    // Seed welcome message
    appendMessage('Hola, soy tu asistente. Escribe algo y te responderé aquí.', 'bot');
});

document.getElementById('descargarPDF').addEventListener('click', () => {
    
    const elemento = document.getElementById('contenidoPDF');
    const titulo = document.getElementById('titulo-tema').innerText;
    const nivel = document.getElementById('nivel-educativo').innerText;


    const opciones = {
        margin: 10,
        filename: `${titulo}_${nivel}.pdf`, 
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
            scale: 2, 
            useCORS: true,
            allowTaint: true 
        }, 
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };


    const imgs = elemento.querySelectorAll('img');
    const promesas = Array.from(imgs).map(img => {
        return new Promise(resolve => {
            if (img.complete && img.naturalHeight !== 0) {
                resolve();
            } else {
                img.onload = resolve;
                img.onerror = resolve; 
            }
        });
    });


    Promise.all(promesas)
        .then(() => {
            setTimeout(() => {
                html2pdf().set(opciones).from(elemento).save();
            }, 100);
        })
        .catch(err => {
            console.error("Error al cargar imágenes para el PDF:", err);
            html2pdf().set(opciones).from(elemento).save();
        });
});