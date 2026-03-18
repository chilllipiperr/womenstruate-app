document.addEventListener('DOMContentLoaded', () => {
    // --- Data ---
    // High-quality, aesthetic, minimalistic product imagery
    const products = [
        {
            id: 1,
            name: 'Small Cup',
            price: 299,
            image: 'https://i.postimg.cc/DZbtMcMt/Chat-GPT-Image-Feb-15-2026-10-27-15-PM.png?v=final',
            features: ['Light Flow', 'Beginner Friendly'],
            specs: '38mm • 55mm • 16ml',
            desc: 'Recommended for teens and first-time users under 18 years of age. Ideal for light flow and individuals with a lower cervix. Designed for beginners seeking a smaller, more comfortable fit.'
        },
        {
            id: 2,
            name: 'Medium Cup',
            price: 399,
            image: 'https://i.postimg.cc/gJkxyntr/Chat-GPT-Image-Feb-16-2026-01-01-04-AM.png?v=final',
            features: ['Medium Flow', 'Standard Fit'],
            specs: '42mm • 59mm • 21ml',
            desc: 'Recommended for individuals above 18 years who have not given birth or have delivered via C-section. Suitable for moderate flow and average cervix height.'
        },
        {
            id: 3,
            name: 'Large Cup',
            price: 499,
            image: 'https://i.postimg.cc/02LJg5rv/Chat-GPT-Image-Feb-16-2026-01-01-49-AM.png?v=final',
            features: ['Heavy Flow', 'High Capacity'],
            specs: '46mm • 63mm • 26ml',
            desc: 'Recommended for individuals above 18 years who have experienced vaginal childbirth. Designed for higher flow capacity and enhanced support.'
        }
    ];

    const careProducts = [
        {
            id: 4,
            name: 'Sterilizer',
            price: 1299,
            image: 'https://mir-s3-cdn-cf.behance.net/project_modules/disp/a78edc110528733.5ff02909d0dd2.jpg',
            features: ['Steam Clean']
        },
        {
            id: 5,
            name: 'Intimate Wash',
            price: 199,
            image: 'https://i.postimg.cc/zX1VptQm/Chat-GPT-Image-Feb-16-2026-01-05-46-AM.png?v=final',
            features: ['pH Balanced']
        },
        {
            id: 6,
            name: 'Carry Pouch',
            price: 149,
            image: 'https://i.postimg.cc/KzwQdSMJ/Chat-GPT-Image-Feb-16-2026-01-15-27-AM.png',
            features: ['Breathable']
        }
    ];

    // --- State ---
    let cart = [];
    let currentMood = 'Fresh';
    const timestamp = new Date().getTime() + Math.random();
    console.log("Womenstruate App Loaded. Cache Bust: " + timestamp);

    // --- DOM Elements ---
    const productCarousel = document.querySelector('.product-carousel');
    const careCarousel = document.querySelector('.care-carousel');
    const navItems = document.querySelectorAll('.nav-item');
    const screens = document.querySelectorAll('.screen');
    const cartBtn = document.querySelector('.cart-btn');
    const cartBadge = document.querySelector('.cart-badge');
    const cartScreen = document.querySelector('#cart-screen');
    const closeCartBtn = document.querySelector('.close-cart-btn');
    const cartItemsContainer = document.querySelector('.cart-items-container');
    const checkoutBtn = document.querySelector('.checkout-btn');
    const totalAmountEl = document.querySelector('.total-amount');
    const ecoCounter = document.getElementById('eco-counter');
    const accordionHeaders = document.querySelectorAll('.accordion-header');

    // --- Render Functions ---
    function renderProducts(items, container) {
        container.innerHTML = items.map(product => `
            <div class="product-card">
                <div class="product-image-container loading">
                    <img src="${product.image}?v=${timestamp}" alt="${product.name}" class="product-image" onload="this.classList.add('loaded'); this.parentElement.classList.remove('loading');">
                </div>
                <div class="product-info">
                    <h4>${product.name}</h4>
                    <span class="product-price">₹${product.price}</span>
                    <button class="btn-primary" onclick="addToCart(${product.id})">Add to Cart</button>
                    ${product.desc ? `
                    <div class="product-accordion">
                        <button class="product-accordion-header" onclick="toggleProductDetail(this)">
                            <span>Who Is This Size For?</span>
                            <span class="icon">+</span>
                        </button>
                        <div class="product-accordion-content">
                            <span class="size-specs">${product.specs}</span>
                            <p>${product.desc}</p>
                        </div>
                    </div>` : ''}
                </div>
            </div>
        `).join('');
    }

    window.toggleProductDetail = (btn) => {
        const content = btn.nextElementSibling;
        const icon = btn.querySelector('.icon');
        btn.classList.toggle('active');

        if (btn.classList.contains('active')) {
            content.style.maxHeight = content.scrollHeight + "px";
            icon.style.transform = 'rotate(45deg)';
        } else {
            content.style.maxHeight = null;
            icon.style.transform = 'rotate(0deg)';
        }
    };

    renderProducts(products, productCarousel);
    renderProducts(careProducts, careCarousel);

    // --- Cart Logic ---
    window.addToCart = (id) => {
        const allProducts = [...products, ...careProducts];
        const product = allProducts.find(p => p.id === id);

        // Check if item already in cart
        const existingItem = cart.find(item => item.id === id);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ ...product, quantity: 1 });
        }

        updateCartUI();
        animateCartIcon();
    };

    function updateCartUI() {
        // Update Badge
        const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartBadge.textContent = totalCount;

        // Update Cart Screen List
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<div class="empty-cart-message" style="text-align:center; margin-top:50px; color:#999;">Your bag is empty</div>';
            totalAmountEl.textContent = '₹0';
        } else {
            let total = 0;
            cartItemsContainer.innerHTML = cart.map(item => {
                total += item.price * item.quantity;
                return `
                    <div class="cart-item">
                        <img src="${item.image}?v=${timestamp}" alt="${item.name}">
                        <div class="cart-right">
                            <div class="cart-header">
                                <span>${item.name}</span>
                                <span>₹${item.price * item.quantity}</span>
                            </div>
                            <div style="display:flex; justify-content:space-between; align-items:center;">
                                <span style="font-size:12px; color:#777;">Quantity: ${item.quantity}</span>
                                <button onclick="removeFromCart(${item.id})" style="border:none; background:none; color:red; font-size:12px;">Remove</button>
                            </div>
                        </div>
                    </div>
                `;
            }).join('');
            totalAmountEl.textContent = '₹' + total;
        }
    }

    window.removeFromCart = (id) => {
        cart = cart.filter(item => item.id !== id);
        updateCartUI();
    };

    function animateCartIcon() {
        cartBtn.style.transform = 'scale(1.2)';
        setTimeout(() => cartBtn.style.transform = 'scale(1)', 200);
    }

    // Toggle Cart Screen
    cartBtn.addEventListener('click', () => {
        cartScreen.classList.add('active');
    });

    closeCartBtn.addEventListener('click', () => {
        cartScreen.classList.remove('active');
    });

    // --- Navigation Logic ---
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const targetId = item.getAttribute('data-target');
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');

            screens.forEach(screen => {
                screen.classList.remove('active'); // Fade out
                if (screen.id === targetId) {
                    setTimeout(() => {
                        screen.classList.add('active'); // Fade in
                        screen.scrollTop = 0;
                    }, 100);
                }
            });
        });
    });

    // --- Accordion Logic ---
    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const item = header.parentElement;
            const content = item.querySelector('.accordion-content');

            // Toggle current
            if (item.classList.contains('active')) {
                item.classList.remove('active');
                content.style.maxHeight = null;
            } else {
                // Close others (optional, keeps UI clean)
                document.querySelectorAll('.accordion-item').forEach(i => {
                    i.classList.remove('active');
                    i.querySelector('.accordion-content').style.maxHeight = null;
                });

                item.classList.add('active');
                content.style.maxHeight = content.scrollHeight + "px";
            }
        });
    });

    // --- Animated Eco Counter ---
    function animateValue(obj, start, end, duration) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            obj.innerHTML = Math.floor(progress * (end - start) + start).toLocaleString() + "+";
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }

    // Trigger animation when sustainability section is in view (simplified: on load)
    setTimeout(() => {
        animateValue(ecoCounter, 0, 1245000, 2500);
    }, 1000);

    // --- Calendar Logic ---
    const calendarGrid = document.querySelector('.calendar-grid');
    const daysInMonth = 31;
    const today = 15; // Mock Date
    const cycleDays = [13, 14, 15, 16, 17]; // Mock Cycle

    for (let i = 1; i <= daysInMonth; i++) {
        const dayEl = document.createElement('div');
        dayEl.classList.add('calendar-day');
        dayEl.textContent = i;

        if (cycleDays.includes(i)) {
            dayEl.classList.add('active');
            dayEl.style.backgroundColor = 'rgba(124, 106, 138, 0.2)';
            dayEl.style.color = '#7C6A8A';
            dayEl.style.fontWeight = 'bold';
        }

        if (i === today) {
            dayEl.style.border = '2px solid #7C6A8A';
        }

        calendarGrid.appendChild(dayEl);
    }

    // Mood Pills
    const moodPills = document.querySelectorAll('.mood-pill');
    moodPills.forEach(pill => {
        pill.addEventListener('click', () => {
            moodPills.forEach(p => p.classList.remove('active'));
            pill.classList.add('active');
            // Simple feedback
            pill.style.transform = 'scale(1.1)';
            setTimeout(() => pill.style.transform = 'scale(1)', 200);
        });
    });

    // --- Profile & Address Logic ---
    let addresses = [
        { id: 1, label: 'Home', text: '123 Main St, Apartment 4B, New York, NY 10001' },
        { id: 2, label: 'Office', text: '456 Tech Lane, Suite 200, San Francisco, CA 94105' }
    ];

    const editProfileBtn = document.querySelector('.edit-profile-btn');
    const manageAddressesBtn = document.getElementById('manage-addresses-btn');
    const addNewAddressBtn = document.getElementById('add-new-address-btn');
    const backToProfileBtn = document.getElementById('back-to-profile-btn');
    const addressSection = document.getElementById('address-section');
    const profileDashboard = document.querySelector('.profile-dashboard');
    const addressListContainer = document.getElementById('address-list-container');

    const editProfileModal = document.getElementById('edit-profile-modal');
    const addressModal = document.getElementById('address-modal');
    const closeModals = document.querySelectorAll('.close-modal');

    const editProfileForm = document.getElementById('edit-profile-form');
    const addressForm = document.getElementById('address-form');

    const userNameEl = document.querySelector('.user-details h3');
    const userAvatarEls = document.querySelectorAll('.avatar-btn img, .large-avatar');

    // Rendering Addresses
    function renderAddresses() {
        addressListContainer.innerHTML = addresses.map(addr => `
            <div class="address-card">
                <div class="address-info">
                    <strong>${addr.label}</strong>
                    <p>${addr.text}</p>
                </div>
                <div class="address-actions">
                    <button class="text-btn" onclick="editAddress(${addr.id})">Edit</button>
                    <button class="text-btn delete" onclick="deleteAddress(${addr.id})">Delete</button>
                </div>
            </div>
        `).join('');
    }

    // Modal Control
    function openModal(modal) { modal.classList.add('active'); }
    function closeModal(modal) { modal.classList.remove('active'); }

    closeModals.forEach(btn => {
        btn.addEventListener('click', () => {
            closeModal(editProfileModal);
            closeModal(addressModal);
        });
    });

    // Edit Profile
    editProfileBtn.addEventListener('click', () => {
        document.getElementById('edit-user-name').value = userNameEl.textContent;
        document.getElementById('edit-user-img').value = userAvatarEls[0].src;
        openModal(editProfileModal);
    });

    editProfileForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const newName = document.getElementById('edit-user-name').value;
        const newImg = document.getElementById('edit-user-img').value;

        userNameEl.textContent = newName;
        userAvatarEls.forEach(img => img.src = newImg);

        closeModal(editProfileModal);
    });

    // Address Management Navigation
    manageAddressesBtn.addEventListener('click', () => {
        profileDashboard.style.display = 'none';
        addressSection.style.display = 'block';
        renderAddresses();
    });

    backToProfileBtn.addEventListener('click', () => {
        addressSection.style.display = 'none';
        profileDashboard.style.display = 'block';
    });

    // Add/Edit Address
    addNewAddressBtn.addEventListener('click', () => {
        document.getElementById('address-modal-title').textContent = 'Add New Address';
        document.getElementById('address-id').value = '';
        addressForm.reset();
        openModal(addressModal);
    });

    window.editAddress = (id) => {
        const addr = addresses.find(a => a.id === id);
        if (addr) {
            document.getElementById('address-modal-title').textContent = 'Edit Address';
            document.getElementById('address-id').value = addr.id;
            document.getElementById('address-label').value = addr.label;
            document.getElementById('address-text').value = addr.text;
            openModal(addressModal);
        }
    };

    window.deleteAddress = (id) => {
        if (confirm('Are you sure you want to delete this address?')) {
            addresses = addresses.filter(a => a.id !== id);
            renderAddresses();
        }
    };

    addressForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const id = document.getElementById('address-id').value;
        const label = document.getElementById('address-label').value;
        const text = document.getElementById('address-text').value;

        if (id) {
            // Edit
            const index = addresses.findIndex(a => a.id == id);
            addresses[index] = { ...addresses[index], label, text };
        } else {
            // Add
            const newId = addresses.length > 0 ? Math.max(...addresses.map(a => a.id)) + 1 : 1;
            addresses.push({ id: newId, label, text });
        }

        renderAddresses();
        closeModal(addressModal);
    });
});
