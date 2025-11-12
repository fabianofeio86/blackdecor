/* Manus Slider and Layout Fixes (FINAL VERSION - V2) */

(function() {
    // 1. INJETAR O CSS DO SLIDER E AS CORREÇÕES DE LAYOUT
    const style = document.createElement('style');
    style.textContent = `
        /* --- CORREÇÃO DE OVERFLOW HORIZONTAL (SOLUÇÃO AGRESSIVA) --- */
        /* Força o body e o container principal a não terem scroll horizontal */
        body, #root {
            overflow-x: hidden !important;
            box-sizing: border-box !important;
        }

        /* --- CORREÇÃO DE PADDING PARA O CONTEÚDO PRINCIPAL --- */
        /* Remove o padding do #root > div para que o fundo azul ocupe 100% */
        #root > div {
            padding-left: 0 !important;
            padding-right: 0 !important;
            box-sizing: border-box !important;
        }

        /* --- CORREÇÃO DO CONTAINER DA SEÇÃO PRINCIPAL (FUNDO AZUL) --- */
        /* Força o container da seção principal a ter 100% da largura e esconde o overflow */
        /* O seletor .sc-b... é o container do fundo azul */
        .sc-bZnhyY {
            width: 100% !important;
            overflow: hidden !important;
            box-sizing: border-box !important;
        }

        /* --- CORREÇÃO DO CONTEÚDO INTERNO (TEXTO, BOTÕES) --- */
        /* Adiciona o padding de volta ao conteúdo interno para evitar corte */
        .sc-bZnhyY > div {
            padding-left: 15px !important;
            padding-right: 15px !important;
            box-sizing: border-box !important;
        }

        /* --- Estilos do Slider --- */
        .slider-container {
            width: 100%; /* Ocupa 100% da largura do container pai */
            max-width: 600px; /* Mantém um limite máximo em telas grandes */
            margin: 0 auto; /* Centraliza o slider */
            position: relative;
            box-sizing: border-box;
        }

        .before-after-slider-wrapper {
            position: relative;
            width: 100%;
            overflow: hidden;
            border-radius: 8px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
            background-color: #000;
        }

        .before-after-slider {
            position: relative;
            width: 100%;
            cursor: ew-resize;
            user-select: none;
            touch-action: none;
        }

        .before-after-slider img {
            display: block;
            width: 100%;
            height: auto;
            vertical-align: middle;
        }

        .before-image-wrapper {
            position: absolute;
            top: 0;
            left: 0;
            width: 50%;
            height: 100%;
            overflow: hidden;
        }

        .before-image-wrapper img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        .slider-handle {
            position: absolute;
            top: 0;
            left: 50%;
            width: 3px;
            height: 100%;
            background-color: #fff;
            transform: translateX(-50%);
            pointer-events: none;
            z-index: 10;
            box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
        }

        .slider-handle::before, .slider-handle::after {
            content: '';
            position: absolute;
            top: 50%;
            width: 40px;
            height: 40px;
            background-color: #fff;
            border-radius: 50%;
            border: 3px solid #00d4ff;
            transform: translate(-50%, -50%);
            left: 0;
            box-shadow: 0 0 10px rgba(0, 212, 255, 0.5);
        }

        .slider-handle::after {
            left: auto;
            right: 0;
            transform: translate(50%, -50%);
        }

        .slider-label {
            position: absolute;
            top: 15px;
            padding: 6px 12px;
            background-color: rgba(0, 0, 0, 0.6);
            color: #fff;
            font-size: 12px;
            font-weight: 600;
            border-radius: 4px;
            backdrop-filter: blur(4px);
            z-index: 5;
            pointer-events: none;
        }

        .label-before { left: 15px; }
        .label-after { right: 15px; }

        .slider-caption {
            text-align: center;
            color: #666;
            font-size: 13px;
            margin-top: 12px;
            font-style: italic;
        }

        /* --- Correção do "Pisca-Pisca" --- */
        img[alt="Ambiente transformado"] {
            visibility: hidden !important;
            height: 0 !important;
            width: 0 !important;
            position: absolute !important;
        }
    `;
    document.head.appendChild(style);

    // 2. LÓGICA DO SLIDER (EXECUTADA APÓS O CARREGAMENTO DA PÁGINA)
    document.addEventListener('DOMContentLoaded', function() {
        // Atraso para garantir que o React/framework tenha renderizado a imagem
        setTimeout(function() {
            const staticImage = document.querySelector('img[alt="Ambiente transformado"]');

            if (staticImage) {
                const sliderHTML = `
                    <div class="slider-container">
                        <div class="before-after-slider-wrapper">
                            <div class="before-after-slider" id="beforeAfterSlider">
                                <img src="assets/after_optimized.webp" alt="Móvel envelopado na cor verde (Depois)" class="after-image">
                                <div class="before-image-wrapper" id="beforeImageWrapper">
                                    <img src="assets/before_optimized.webp" alt="Móvel original na cor madeira (Antes)" class="before-image">
                                </div>
                                <div class="slider-handle" id="sliderHandle"></div>
                                <div class="slider-label label-before">ANTES</div>
                                <div class="slider-label label-after">DEPOIS</div>
                            </div>
                        </div>
                        <p class="slider-caption">↔ Deslize para ver a transformação completa</p>
                    </div>
                `;

                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = sliderHTML.trim();
                const sliderElement = tempDiv.firstChild;

                // Encontra o container da imagem para substituí-lo
                const parentContainer = staticImage.closest('div');
                if (parentContainer) {
                    parentContainer.replaceWith(sliderElement);
                } else {
                    staticImage.replaceWith(sliderElement);
                }

                // Lógica de funcionamento do slider
                const slider = document.getElementById('beforeAfterSlider');
                const beforeWrapper = document.getElementById('beforeImageWrapper');
                const handle = document.getElementById('sliderHandle');
                let isActive = false;

                function updateSliderPosition(e) {
                    if (!isActive) return;
                    const rect = slider.getBoundingClientRect();
                    let x = e.clientX || (e.touches && e.touches[0].clientX) || 0;
                    let position = x - rect.left;
                    if (position < 0) position = 0;
                    if (position > rect.width) position = rect.width;
                    const percentage = (position / rect.width) * 100;
                    beforeWrapper.style.width = percentage + '%';
                    handle.style.left = percentage + '%';
                }

                slider.addEventListener('mousedown', function(e) { isActive = true; updateSliderPosition(e); });
                document.addEventListener('mouseup', function() { isActive = false; });
                document.addEventListener('mousemove', updateSliderPosition);

                slider.addEventListener('touchstart', function(e) { isActive = true; updateSliderPosition(e); });
                document.addEventListener('touchend', function() { isActive = false; });
                document.addEventListener('touchmove', updateSliderPosition);

                // Inicia o slider no meio
                beforeWrapper.style.width = '50%';
                handle.style.left = '50%';
            }
        }, 1500); // Atraso de 1.5s
    });
})();
