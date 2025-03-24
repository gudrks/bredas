const numeroWhatsapp = "5518996547044";

async function login() {
    try {
        const response = await fetch("https://production.bredasapi.com.br/overall/auth/usuario", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ Grupo: "unimar", Login: "unimar", Senha: "unimar" })
        });
        if (!response.ok) throw new Error("Falha no login");
        const data = await response.json();
        return data.data.access_token;
    } catch (error) {
        console.error("Erro ao fazer login:", error);
    }
}

async function fetchProdutos(token) {
    try {
        const response = await fetch("https://production.bredasapi.com.br/erpproduto/integracaounimar", {
            method: "GET",
            headers: { "Authorization": token }
        });

        if (!response.ok) throw new Error("Falha ao buscar produtos");

        const data = await response.json();
        return data.data || [];
    } catch (error) {
        console.error("Erro ao buscar produtos:", error);
        return [];
    }
}

async function carregarProdutos() {
    try {
        const token = await login();
        if (!token) throw new Error("Token não obtido");

        const produtos = await fetchProdutos(token);
        if (!Array.isArray(produtos)) throw new Error("Formato de dados inesperado");

        const container = document.getElementById("produtos-container");
        container.innerHTML = "";

        produtos.forEach(produto => {
            console.log(produto.imagens.length)
            const imagem = produto.imagens.length > 0 ? produto.imagens[0].urlImagem : "https://placehold.co/600x400";
            const preco = produto.valorVenda ? `R$ ${produto.valorVenda.toFixed(2).replace('.', ',')}` : "Preço indisponível";

            const card = document.createElement("div");
            card.className = "product-card";

            const linkWhatsapp = `https://wa.me/${numeroWhatsapp}?text=Olá,%20gostaria%20de%20comprar%20o%20produto%20${produto.descricao}%20por%20${preco}.`;

            card.innerHTML = `
                <div>
                    <img src="${imagem}" alt="${produto.descricao}" class="product-image">
                </div>
                <div class="product-info">
                    <h3>${produto.descricao}</h3>
                    <div class="price">${preco}</div>
                </div>
                <a href="${linkWhatsapp}" target="_blank" class="whatsapp-button">Comprar no WhatsApp</a>
            `;

            container.appendChild(card);
        });
    } catch (error) {
        console.error("Erro ao carregar produtos:", error);
    }
}

carregarProdutos();
