

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
const db = firebase.firestore();
const storage = firebase.storage();

// Adicionar produto
document.getElementById('productForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const name = document.getElementById('productName').value;
    const description = document.getElementById('productDescription').value;
    const whatsapp = document.getElementById('whatsappNumber').value;
    const file = document.getElementById('productImage').files[0];

    // Upload da imagem
    const storageRef = storage.ref(`images/${file.name}`);
    await storageRef.put(file);
    const imageUrl = await storageRef.getDownloadURL();

    // Salvar dados do produto no Firestore
    await db.collection('produtos').add({
        name,
        description,
        whatsapp,
        imageUrl
    });

    document.getElementById('productForm').reset();
    loadProducts();
});

// Carregar produtos
async function loadProducts() {
    const productList = document.getElementById('productList');
    productList.innerHTML = '';

    const snapshot = await db.collection('produtos').get();
    snapshot.forEach(doc => {
        const data = doc.data();
        productList.innerHTML += `
            <div>
                <h3>${data.name}</h3>
                <p>${data.description}</p>
                <p>Contato: <a href="https://wa.me/${data.whatsapp}">${data.whatsapp}</a></p>
                <img src="${data.imageUrl}" alt="${data.name}" style="width: 100px; height: auto;">
            </div>
        `;
    });
}

loadProducts();