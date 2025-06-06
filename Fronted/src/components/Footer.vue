<script setup>
const openWhatsApp = () => {
  const whatsappNumber = '50379565203';
  const whatsappLink = `https://wa.me/${encodeURIComponent(whatsappNumber)}`;
  window.open(whatsappLink, '_blank', 'noopener,noreferrer');
};
</script>

<template>
    <footer>
        <div class="footer-social p-3 mt-3 w-full h-auto bg-gray-950 text-white flex flex-col md:flex-row justify-between items-center md:justify-between" id="Contactos">
            <div class="flex gap-4 mb-4 md:mb-0">
                <h4 class="font-bold">Síguenos en nuestras redes sociales:</h4>
                <a @click="openWhatsApp" class="cursor-pointer">
                    <img src="/img/whatsapp.png" alt="WhatsApp" width="25">
                </a>
                <a href="https://www.facebook.com/people/El-Churrasco/61554004262366/?_rdr" target="_blank" rel="noopener noreferrer">
                    <img src="/img/facebook.png" alt="Facebook" width="25">
                </a>
            </div>
        
            <div class="footer-copy text-center md:text-end"> 
                <p class="text-xm">Copyright © 2025 El Churrasco Restaurante</p>
                <p class="text-xm">All rights reserved</p>
            </div>
        </div>
    </footer>
</template>