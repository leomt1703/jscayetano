// ==UserScript==
// @name         Imagen en esquina
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Colocar un moñito a la cayetano y ponerle un título decoroso que cambie
// @author       leo
// @match        https://portalmatricula.cayetano.pe/*
// @grant        GM_addStyle
// ==/UserScript==

// Clase TitlesManager
class TitlesManager {
  constructor() {
    this.usedTitles = [];
    this.titles = null; // Para almacenar los títulos una vez obtenidos
  }

  // Método para obtener y cachea títulos
  async getTitles() {
    if (this.titles) {
      return this.titles;
    }

    const titlesURL = 'https://raw.githubusercontent.com/leomt1703/jscayetano/main/titles';

    try {
      const response = await fetch(titlesURL);
      const data = await response.text();
      this.titles = data.split("\n").map((title) => title.trim());
      return this.titles;
    } catch (error) {
      console.error("Error obteniendo los títulos", error);
      return [];
    }
  }

  // Método para obtener un título aleatorio no utilizado
  getRandomTitle() {
    // Si todos los títulos se han utilizado, reiniciar el registro
    if (this.usedTitles.length === this.titles.length) {
      this.usedTitles = [];
    }

    let index;
    do {
      // Elegir un índice aleatorio
      index = Math.floor(Math.random() * this.titles.length);
    } while (this.usedTitles.includes(index)); // Asegurarse de que el título no se haya utilizado antes

    // Registrar el índice elegido
    this.usedTitles.push(index);

    // Devolver el título correspondiente al índice
    return this.titles[index];
  }
}

(function() {
    'use strict';

    // Instancia de la clase TitlesManager
    const manager = new TitlesManager();

    // Crear el elemento de la imagen
    const img = document.createElement('img');
    img.src = 'https://github.com/leomt1703/jscayetano/blob/main/cinta%20rosada.png?raw=true';
    img.style.position = 'fixed'; // Cambiar a posición fija
    img.style.top = '-6.5%';
    img.style.left = '0%';
    img.style.transform = 'rotate(100deg) scale(0.7)';
    img.style.zIndex = '9999';
    img.style.opacity = '1';

    // Añadir la imagen al cuerpo del documento
    document.body.appendChild(img);

    // Aplicar estilos directamente
    img.style.opacity = '1';
    img.style.transform = 'scale(0.7)';

    // Otra opción: clase CSS específica
    img.classList.add('mi-imagen');

    // El CSS solo afectará esta imagen
    GM_addStyle(`
        .mi-imagen {
            opacity: 1 !important;
            transform: scale(0.7) !important;
        }
    `);

    // Código para cambiar el título dinámicamente
    const titleElement = document.querySelector("h5");

    // Obtener y establecer título
    manager.getTitles().then(() => {
      setTitle();
      setInterval(setTitle, 7000); // Actualiza cada 7 segundos
    });

    function setTitle() {
      const title = manager.getRandomTitle();
      titleElement.innerText = `PORTAL DE MATRÍCULA - ${title}`;
    }
})();
