// Configuração do Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCzYNZNSqCZkvtzqC8-JIIKExtGVKJC6tc",
    authDomain: "marketsrc-cb564.firebaseapp.com",
    projectId: "marketsrc-cb564",
    storageBucket: "marketsrc-cb564.appspot.com",
    messagingSenderId: "929727087008",
    appId: "1:929727087008:web:d6bd0c309c54da5b1f64c5",
    measurementId: "G-70G8YMLKE3"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();
const storage = firebase.storage();

// Adicionar produto
document.getElementById('productForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const name = document.getElementById('productName').value;
    const description = document.getElementById('productDescription').value;
    const whatsapp = document.getElementById('whatsappNumber').value;
    const file = document.getElementById('productImage').files[0];

    try {
        // Upload da imagem
        const storageRef = storage.ref(`images/${file.name}`);
        await storageRef.put(file);
        const imageUrl = await storageRef.getDownloadURL();

        // Salvar dados do produto no Realtime Database
        await db.ref('produtos/').push({
            name: name,
            description: description,
            whatsapp: whatsapp,
            imageUrl: imageUrl
        });

        console.log('Produto adicionado com sucesso!');
        document.getElementById('productForm').reset();
        loadProducts();

    } catch (error) {
        console.error('Erro ao adicionar produto:', error);
    }
});

// Carregar produtos
async function loadProducts() {
    const productList = document.getElementById('productList');
    productList.innerHTML = '';

    db.ref('produtos/').once('value', (snapshot) => {
        snapshot.forEach((childSnapshot) => {
            const data = childSnapshot.val();
            productList.innerHTML += `
                <div>
                    <h3>${data.name}</h3>
                    <p>${data.description}</p>
                    <p>Contato: <a href="https://wa.me/${data.whatsapp}">${data.whatsapp}</a></p>
                    <img src="${data.imageUrl}" alt="${data.name}" style="width: 100px; height: auto;">
                </div>
            `;
        });
    });
}

// Carregar produtos ao iniciar
loadProducts();
