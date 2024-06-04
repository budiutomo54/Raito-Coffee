document.addEventListener("alpine:init", () => {
  Alpine.data("products", () => ({
    items: [
      { id: 1, name: "Iced Matcha Latte", img: "1.jpeg", price: 25000 },
      { id: 2, name: "Frappuccino Caramel", img: "2.jpg", price: 30000 },
      { id: 3, name: "Iced Americano", img: "3.jpg", price: 22000 },
      { id: 4, name: "Latte", img: "4.jpg", price: 22000 },
      { id: 5, name: "Espresso", img: "5.jpg", price: 17000 },
      { id: 6, name: "Original", img: "6.jpg", price: 19000 },
    ],
  }));

  Alpine.store("cart", {
    items: [],
    quantity: 0,
    total: 0,
    init() {
      const cartData = localStorage.getItem("cart");
      if (cartData) {
        const parsedCart = JSON.parse(cartData);
        this.items = parsedCart.items || [];
        this.quantity = parsedCart.quantity || 0;
        this.total = parsedCart.total || 0;
      }
    },
    saveCart() {
      localStorage.setItem(
        "cart",
        JSON.stringify({
          items: this.items,
          quantity: this.quantity,
          total: this.total,
        })
      );
    },
    add(productToAdd) {
      // Convert price to number
      productToAdd.price = Number(productToAdd.price); // Check if the product is already in the cart

      const cartItem = this.items.find((item) => item.id === productToAdd.id);

      if (!cartItem) {
        // If cart is empty
        this.items.push({
          ...productToAdd,
          quantity: 1,
          total: productToAdd.price,
        });
        this.quantity++;
        this.total += productToAdd.price;
      } else {
        // If product is already in the cart
        this.items = this.items.map((item) => {
          if (item.id !== productToAdd.id) {
            return item;
          } else {
            item.quantity++;
            item.total = item.price * item.quantity;
            this.quantity++;
            this.total += item.price;
            return item;
          }
        });
      }
      this.saveCart(); // Save cart to localStorage after adding an item
    },
    remove(id) {
      // Get the item from the cart
      const cartItem = this.items.find((item) => item.id === id);

      if (cartItem.quantity > 1) {
        // If more than one item
        this.items = this.items.map((item) => {
          if (item.id !== id) {
            return item;
          } else {
            item.quantity--;
            item.total = item.price * item.quantity;
            this.quantity--;
            this.total -= item.price;
            return item;
          }
        });
      } else if (cartItem.quantity === 1) {
        // If only one item left
        this.items = this.items.filter((item) => item.id !== id);
        this.quantity--;
        this.total -= cartItem.price;
      }
      this.saveCart(); // Save cart to localStorage after removing an item
    },
  });
});

// Function to convert number to Rupiah format
const rupiah = (number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(number);
};
