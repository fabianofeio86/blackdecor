# Instruções para Configurar Google Ads

## Como adicionar seus códigos do Google Ads

### 1. No arquivo `index.html`:

Substitua as linhas comentadas (entre `<!--` e `-->`) pelos seus códigos reais:

```html
<!-- Descomente e substitua GOOGLE_ADS_ID pelo seu ID real -->
<script async src="https://www.googletagmanager.com/gtag/js?id=AW-SEU_ID_AQUI"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'AW-SEU_ID_AQUI');
</script>
```

### 2. No arquivo `src/App.jsx`:

Na linha 48, substitua:
```javascript
send_to: 'AW-CONVERSION_ID/CONVERSION_LABEL'
```

Por seus códigos reais:
```javascript
send_to: 'AW-SEU_ID/SEU_LABEL_DE_CONVERSAO'
```

## Eventos que estão sendo rastreados:

1. **Cliques no WhatsApp** - Categoria: 'WhatsApp'
2. **Envio de formulário** - Categoria: 'Form' (conversão)

## Como encontrar seus códigos:

1. Acesse sua conta do Google Ads
2. Vá em "Ferramentas e configurações" > "Conversões"
3. Clique na conversão que você quer rastrear
4. Copie o código de acompanhamento

## Testando o rastreamento:

Após adicionar os códigos, você pode testar usando:
- Google Tag Assistant (extensão do Chrome)
- Console do navegador (F12) para ver se os eventos estão sendo disparados

## Contatos configurados:

- **WhatsApp**: +55 51 99399-6732
- **Email**: contato@blackpeliculas.com.br

