const selector = (element) => document.querySelector(element);
const selectorAll = (element) => document.querySelectorAll(element);

// Quantidade de pizzas
let modalQtd = 1;
// pizza está sendo clicada
let modalKey = 0;
// carrinho
let cart = [];

// Renderizar as pizzas
pizzaJson.map((pizza, index) => {
  // CloneNode copia todos os filhos da div selecionada
  const pizzaItem = selector('.pizza-item').cloneNode(true);
  selector('.pizza-area').append( pizzaItem );
  // O atributo data-key para quando clicar na pizza, exibir os dados dela no modal
  pizzaItem.setAttribute('data-key', index);

  pizzaItem.querySelector('.pizza-item-img img').src = pizza.img;
  pizzaItem.querySelector('.pizza-item-price').innerHTML = `R$ ${pizza.price.toFixed(2)}`;
  pizzaItem.querySelector('.pizza-item-name').innerHTML = pizza.name;
  pizzaItem.querySelector('.pizza-item-desc').innerHTML = pizza.description;

  // Abrir o modal
  pizzaItem.querySelector('.click-pizza').addEventListener('click', (e) => {
    e.preventDefault();
    // Element.closest() retorna o ancestral mais próximo, em relação ao elemento atual
    const key = e.target.closest('.pizza-item').getAttribute('data-key');
    modalQtd = 1;
    // pegar qual pizza está sendo clicada
    modalKey = key;

    selector('.pizzaBig img').src = pizzaJson[key].img;
    selector('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
    selector('.pizzaInfo--desc').innerHTML = pizzaJson[key].description;
    selector('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[key].price.toFixed(2)}`;
    selector('.pizzaInfo--size.selected').classList.remove('selected');
    selectorAll('.pizzaInfo--size').forEach((size, sizeIndex) => {
      if(sizeIndex === 2 ) {
        size.classList.add('selected');
      }
      size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex];
    })

    selector('.pizzaInfo--qt').innerHTML = modalQtd;

    setTimeout(() => {
      selector('.pizzaWindowArea').style.opacity = 1;
    }, 200)
    selector('.pizzaWindowArea').style.display = 'flex';
  })
});

// Eventos do Modal
const btnCloseModal = selectorAll('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton');
btnCloseModal.forEach((item) => {
  item.addEventListener('click', closeModal);
})
// Fechar modal
function closeModal() {
  selector('.pizzaWindowArea').style.opacity = 0;
  setTimeout(() => {
    selector('.pizzaWindowArea').style.display = 'none';
  }, 500)
}

// Botões para aumentar e diminuir
selector('.pizzaInfo--qtmenos').addEventListener('click', () => {
  if(modalQtd > 1) {
    modalQtd--;
    selector('.pizzaInfo--qt').innerHTML = modalQtd;
  }
})
selector('.pizzaInfo--qtmais').addEventListener('click', () => {
  modalQtd++;
  selector('.pizzaInfo--qt').innerHTML = modalQtd;
})

// Botões tamanho da pizza
selectorAll('.pizzaInfo--size').forEach((size, sizeIndex) => {
  size.addEventListener('click', () => {
    selector('.pizzaInfo--size.selected').classList.remove('selected');
    size.classList.add('selected')
  })
})

// Adicionar a pizza no carrinho
selector('.pizzaInfo--addButton').addEventListener('click', () => {
  // pegar o tamanho da pizza selecionada
  let size = parseInt(selector('.pizzaInfo--size.selected').getAttribute('data-key'));
  // Criar um identificador que pega a pizza selecionada mais o tamanho dela
  let identificador = pizzaJson[modalKey].id+'@'+size;

  // Verificar se já tem a pizza selecionada no carrinho
  let keyIdentificador = cart.findIndex((item) => item.identificador == identificador);
  // (if) Se ele achar a pizza vai somente aumentar a quantidade,(else) se não vai add uma nova
  if (keyIdentificador > -1) {
    cart[keyIdentificador].quantity += modalQtd;
  } else {
    cart.push({
      identificador,
      id:pizzaJson[modalKey].id,
      size,
      quantity:modalQtd
    });
  }

  updateCart();
  closeModal();
});

// Abrir carrinho mobile
selector('.menu-openner').addEventListener('click', () => {
    if (cart.length > 0) return selector('aside').style.left = '0';
})
selector('.menu-closer').addEventListener('click', () => {
    if (cart.length > 0) return selector('aside').style.left = '100vw';
})

// Abrindo carrinho
function updateCart() {
  // Carrinho Mobile
  selector('.menu-openner span').innerHTML = cart.length;

  if(cart.length > 0 ) {
    selector('aside').classList.add('show');
    selector('.cart').innerHTML = '';

    // Variaveis do carrinho
    let subtotal = 0;
    let desconto = 0;
    let total = 0;

    for (const i in cart) {
      const pizzaItem = pizzaJson.find((item) => item.id == cart[i].id)
      // Somando o preço * a quantidade de itens no carrinho
      subtotal += pizzaItem.price * cart[i].quantity;

      const cartItem = selector('.cart-item').cloneNode(true);
      selector('.cart').append(cartItem);


      let pizzaItemSize;
      if(cart[i].size === 0) pizzaItemSize = 'P';
      if(cart[i].size === 1) pizzaItemSize = 'M';
      if(cart[i].size === 2) pizzaItemSize = 'G';

      const pizzaName = `${pizzaItem.name} (${pizzaItemSize})`

      cartItem.querySelector('img').src = pizzaItem.img;
      cartItem.querySelector('.cart-item-nome').innerHTML = pizzaName;
      cartItem.querySelector('.cart-item-qt').innerHTML = cart[i].quantity;
      // Diminuir mais pizza já dentro do carrinho
      cartItem.querySelector('.cart-item-qtmenos').addEventListener('click', () => {
        if (cart[i].quantity > 1 ) {
          cart[i].quantity--;
        } else {
          cart.splice(i, 1);
        }
        updateCart();
      })
      // Adicionar mais pizza já dentro do carrinho
      cartItem.querySelector('.cart-item-qtmais').addEventListener('click', () => {
        cart[i].quantity++;
        updateCart();
      })
    }
    // O Resto da soma tem que ser fora do for!
    desconto = subtotal * 0.1;
    total = subtotal - desconto;

    selector('.subtotal span:last-child').innerHTML =`R$ ${subtotal.toFixed(2)}`;
    selector('.desconto span:last-child').innerHTML =`R$ ${desconto.toFixed(2)}`;
    selector('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`;

  } else {
    selector('aside').classList.remove('show');
    selector('aside').style.left = '100vw';
  }
}
