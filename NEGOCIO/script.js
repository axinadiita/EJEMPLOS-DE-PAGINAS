/* =========================================
   PRODUCTOS
========================================= */

const products = [
    {
        id: 1,
        name: "Polera Essential",
        category: "poleras",
        price: 12990,
        description: "Polera básica y cómoda para todos los días.",
        emoji: "👕"
    },

    {
        id: 2,
        name: "Polera Oversize",
        category: "poleras",
        price: 15990,
        description: "Corte oversize para un look relajado.",
        emoji: "👚"
    },

    {
        id: 3,
        name: "Jean Classic",
        category: "pantalones",
        price: 24990,
        description: "Jean clásico fácil de combinar.",
        emoji: "👖"
    },

    {
        id: 4,
        name: "Pantalón Cargo",
        category: "pantalones",
        price: 29990,
        description: "Diseño urbano con múltiples bolsillos.",
        emoji: "👖"
    },

    {
        id: 5,
        name: "Vestido Aura",
        category: "vestidos",
        price: 32990,
        description: "Vestido elegante y femenino.",
        emoji: "👗"
    },

    {
        id: 6,
        name: "Vestido Casual",
        category: "vestidos",
        price: 27990,
        description: "Perfecto para una salida casual.",
        emoji: "👗"
    },

    {
        id: 7,
        name: "Bolso Mini",
        category: "accesorios",
        price: 18990,
        description: "Bolso compacto para complementar tu look.",
        emoji: "👜"
    },

    {
        id: 8,
        name: "Gorro Básico",
        category: "accesorios",
        price: 9990,
        description: "Gorro cómodo para completar cualquier outfit.",
        emoji: "🧢"
    }
];


/* =========================================
   VARIABLES
========================================= */

let cart = JSON.parse(localStorage.getItem("aureaCart")) || [];

let reviews =
    JSON.parse(localStorage.getItem("aureaReviews")) || [];

let selectedRating = 0;

let currentCategory = "todos";


/* =========================================
   ELEMENTOS HTML
========================================= */

const productsContainer =
    document.getElementById("productsContainer");

const searchInput =
    document.getElementById("searchInput");

const noResults =
    document.getElementById("noResults");

const cartButton =
    document.getElementById("cartButton");

const cartOverlay =
    document.getElementById("cartOverlay");

const closeCart =
    document.getElementById("closeCart");

const cartItems =
    document.getElementById("cartItems");

const cartCount =
    document.getElementById("cartCount");

const cartTotal =
    document.getElementById("cartTotal");

const clearCart =
    document.getElementById("clearCart");

const checkoutButton =
    document.getElementById("checkoutButton");

const toast =
    document.getElementById("toast");

const menuButton =
    document.getElementById("menuButton");

const navMenu =
    document.getElementById("navMenu");


/* =========================================
   FORMATO DE DINERO
========================================= */

function formatPrice(price) {

    return new Intl.NumberFormat("es-CL", {
        style: "currency",
        currency: "CLP",
        maximumFractionDigits: 0
    }).format(price);

}


/* =========================================
   MOSTRAR PRODUCTOS
========================================= */

function renderProducts() {

    const searchTerm =
        searchInput.value
            .toLowerCase()
            .trim();

    const filteredProducts =
        products.filter(product => {

            const matchesCategory =
                currentCategory === "todos" ||
                product.category === currentCategory;

            const matchesSearch =
                product.name
                    .toLowerCase()
                    .includes(searchTerm) ||
                product.description
                    .toLowerCase()
                    .includes(searchTerm);

            return matchesCategory && matchesSearch;

        });


    productsContainer.innerHTML = "";


    if (filteredProducts.length === 0) {

        noResults.style.display = "block";

        return;

    }


    noResults.style.display = "none";


    filteredProducts.forEach(product => {

        const card =
            document.createElement("article");

        card.className = "product-card";


        card.innerHTML = `

            <div class="product-image">
                ${product.emoji}
            </div>

            <div class="product-info">

                <span class="product-category">
                    ${product.category}
                </span>

                <h3>
                    ${product.name}
                </h3>

                <p>
                    ${product.description}
                </p>

                <div class="product-bottom">

                    <span class="product-price">
                        ${formatPrice(product.price)}
                    </span>

                    <button
                        class="add-button"
                        data-id="${product.id}">
                        Agregar
                    </button>

                </div>

            </div>
        `;


        productsContainer.appendChild(card);

    });


    document
        .querySelectorAll(".add-button")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const id =
                        Number(button.dataset.id);

                    addToCart(id);

                }
            );

        });

}


/* =========================================
   FILTROS
========================================= */

document
    .querySelectorAll(".category-button")
    .forEach(button => {

        button.addEventListener("click", () => {

            document
                .querySelectorAll(".category-button")
                .forEach(btn =>
                    btn.classList.remove("active")
                );

            button.classList.add("active");

            currentCategory =
                button.dataset.category;

            renderProducts();

        });

    });


/* =========================================
   BUSCADOR
========================================= */

searchInput.addEventListener(
    "input",
    renderProducts
);


/* =========================================
   CARRITO
========================================= */

function addToCart(productId) {

    const product =
        products.find(
            item => item.id === productId
        );

    if (!product) return;


    const existingProduct =
        cart.find(
            item => item.id === productId
        );


    if (existingProduct) {

        existingProduct.quantity++;

    } else {

        cart.push({
            ...product,
            quantity: 1
        });

    }


    saveCart();

    renderCart();

    showToast("Producto agregado al carrito ♡");

}


/* =========================================
   GUARDAR CARRITO
========================================= */

function saveCart() {

    localStorage.setItem(
        "aureaCart",
        JSON.stringify(cart)
    );

}


/* =========================================
   MOSTRAR CARRITO
========================================= */

function renderCart() {

    cartItems.innerHTML = "";


    if (cart.length === 0) {

        cartItems.innerHTML = `
            <div class="empty-cart">
                <p>Tu carrito está vacío.</p>
                <p>♡</p>
            </div>
        `;

    } else {

        cart.forEach(item => {

            const cartItem =
                document.createElement("div");

            cartItem.className = "cart-item";


            cartItem.innerHTML = `

                <div class="cart-item-image">
                    ${item.emoji}
                </div>

                <div>

                    <h4>
                        ${item.name}
                    </h4>

                    <p>
                        ${formatPrice(item.price)}
                        × ${item.quantity}
                    </p>

                </div>

                <button
                    class="remove-item"
                    data-id="${item.id}">
                    ✕
                </button>

            `;


            cartItems.appendChild(cartItem);

        });


        document
            .querySelectorAll(".remove-item")
            .forEach(button => {

                button.addEventListener(
                    "click",
                    () => {

                        const id =
                            Number(button.dataset.id);

                        removeFromCart(id);

                    }
                );

            });

    }


    const totalItems =
        cart.reduce(
            (total, item) =>
                total + item.quantity,
            0
        );


    const totalPrice =
        cart.reduce(
            (total, item) =>
                total +
                item.price * item.quantity,
            0
        );


    cartCount.textContent =
        totalItems;

    cartTotal.textContent =
        formatPrice(totalPrice);

}


/* =========================================
   ELIMINAR PRODUCTO
========================================= */

function removeFromCart(productId) {

    cart =
        cart.filter(
            item => item.id !== productId
        );

    saveCart();

    renderCart();

}


/* =========================================
   VACIAR CARRITO
========================================= */

clearCart.addEventListener(
    "click",
    () => {

        if (cart.length === 0) return;


        const confirmation =
            confirm(
                "¿Quieres vaciar el carrito?"
            );


        if (confirmation) {

            cart = [];

            saveCart();

            renderCart();

        }

    }
);


/* =========================================
   ABRIR CARRITO
========================================= */

cartButton.addEventListener(
    "click",
    () => {

        cartOverlay.classList.add("open");

    }
);


/* =========================================
   CERRAR CARRITO
========================================= */

closeCart.addEventListener(
    "click",
    () => {

        cartOverlay.classList.remove("open");

    }
);


cartOverlay.addEventListener(
    "click",
    event => {

        if (event.target === cartOverlay) {

            cartOverlay.classList.remove("open");

        }

    }
);


/* =========================================
   WHATSAPP
========================================= */

checkoutButton.addEventListener(
    "click",
    () => {

        if (cart.length === 0) {

            alert(
                "Agrega al menos un producto al carrito."
            );

            return;

        }


        let message =
            "Hola! Quiero hacer un pedido:%0A%0A";


        cart.forEach(item => {

            message +=
                `• ${item.name} x${item.quantity} - ${formatPrice(item.price * item.quantity)}%0A`;

        });


        const total =
            cart.reduce(
                (sum, item) =>
                    sum +
                    item.price * item.quantity,
                0
            );


        message +=
            `%0ATotal: ${formatPrice(total)}`;


        /*
            CAMBIA ESTE NÚMERO POR
            EL WHATSAPP DE TU EMPRENDIMIENTO.

            IMPORTANTE:
            Escríbelo con código de país,
            sin +, espacios ni guiones.

            Ejemplo Chile:
            56912345678
        */

        const phone =
            "56912345678";


        const url =
            `https://wa.me/${phone}?text=${message}`;


        window.open(
            url,
            "_blank"
        );

    }
);


/* =========================================
   TOAST
========================================= */

function showToast(message) {

    toast.textContent =
        message;

    toast.classList.add("show");


    setTimeout(() => {

        toast.classList.remove("show");

    }, 2500);

}


/* =========================================
   MENÚ MÓVIL
========================================= */

menuButton.addEventListener(
    "click",
    () => {

        navMenu.classList.toggle("open");

    }
);


/* Cerrar menú después de
   tocar un enlace */

document
    .querySelectorAll(".nav a")
    .forEach(link => {

        link.addEventListener(
            "click",
            () => {

                navMenu.classList.remove("open");

            }
        );

    });


/* =========================================
   VALORACIONES
========================================= */

const ratingButtons =
    document.querySelectorAll(
        ".rating-input button"
    );


ratingButtons.forEach(button => {

    button.addEventListener(
        "click",
        () => {

            selectedRating =
                Number(button.dataset.rating);

            updateRatingButtons();

        }
    );

});


function updateRatingButtons() {

    ratingButtons.forEach(button => {

        const rating =
            Number(button.dataset.rating);

        button.textContent =
            rating <= selectedRating
                ? "★"
                : "☆";

    });

}


/* =========================================
   FORMULARIO DE RESEÑAS
========================================= */

const reviewForm =
    document.getElementById(
        "reviewForm"
    );


reviewForm.addEventListener(
    "submit",
    event => {

        event.preventDefault();


        const name =
            document
                .getElementById("reviewName")
                .value
                .trim();


        const text =
            document
                .getElementById("reviewText")
                .value
                .trim();


        if (selectedRating === 0) {

            alert(
                "Selecciona una valoración de 1 a 5 estrellas."
            );

            return;

        }


        const newReview = {

            id: Date.now(),

            name: name,

            rating: selectedRating,

            text: text,

            date:
                new Date().toLocaleDateString(
                    "es-CL"
                )

        };


        reviews.unshift(
            newReview
        );


        localStorage.setItem(
            "aureaReviews",
            JSON.stringify(reviews)
        );


        reviewForm.reset();

        selectedRating = 0;

        updateRatingButtons();

        renderReviews();

        showToast(
            "¡Gracias por compartir tu opinión! ♡"
        );

    }
);


/* =========================================
   MOSTRAR RESEÑAS
========================================= */

function renderReviews() {

    const container =
        document.getElementById(
            "reviewsContainer"
        );


    container.innerHTML = "";


    if (reviews.length === 0) {

        container.innerHTML = `
            <div class="review">
                <p>
                    Todavía no hay valoraciones.
                    ¡Sé la primera persona en comentar! ♡
                </p>
            </div>
        `;

    } else {

        reviews.forEach(review => {

            const element =
                document.createElement("article");

            element.className = "review";


            const stars =
                "★".repeat(review.rating) +
                "☆".repeat(5 - review.rating);


            element.innerHTML = `

                <div class="review-header">

                    <span class="review-name">
                        ${escapeHTML(review.name)}
                    </span>

                    <span class="review-date">
                        ${review.date}
                    </span>

                </div>

                <div class="review-stars">
                    ${stars}
                </div>

                <p class="review-text">
                    ${escapeHTML(review.text)}
                </p>

            `;


            container.appendChild(
                element
            );

        });

    }


    updateRatingSummary();

}


/* =========================================
   RESUMEN DE ESTRELLAS
========================================= */

function updateRatingSummary() {

    const averageElement =
        document.getElementById(
            "averageRating"
        );

    const starsElement =
        document.getElementById(
            "averageStars"
        );

    const countElement =
        document.getElementById(
            "reviewCount"
        );


    if (reviews.length === 0) {

        averageElement.textContent =
            "0.0";

        starsElement.textContent =
            "☆☆☆☆☆";

        countElement.textContent =
            "0";

        return;

    }


    const total =
        reviews.reduce(
            (sum, review) =>
                sum + review.rating,
            0
        );


    const average =
        total / reviews.length;


    averageElement.textContent =
        average.toFixed(1);


    const rounded =
        Math.round(average);


    starsElement.textContent =
        "★".repeat(rounded) +
        "☆".repeat(5 - rounded);


    countElement.textContent =
        reviews.length;

}


/* =========================================
   PROTECCIÓN CONTRA HTML
========================================= */

function escapeHTML(text) {

    const div =
        document.createElement("div");

    div.textContent =
        text;

    return div.innerHTML;

}


/* =========================================
   NEWSLETTER
========================================= */

const newsletterForm =
    document.getElementById(
        "newsletterForm"
    );


newsletterForm.addEventListener(
    "submit",
    event => {

        event.preventDefault();


        const email =
            document
                .getElementById("emailInput")
                .value
                .trim();


        if (!email) return;


        document
            .getElementById("newsletterMessage")
            .textContent =
            "¡Gracias por suscribirte! ♡";


        newsletterForm.reset();

    }
);


/* =========================================
   INICIALIZAR
========================================= */

renderProducts();

renderCart();

renderReviews();