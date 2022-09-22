import { pratos, bebidas, sobremesas } from './data.js';

class Produto {
  constructor({ nome, imagem, descricao, preco }, tipo) {
    this.elemento = null;
    this.nome = nome;
    this.imagem = imagem;
    this.descricao = descricao;
    this.preco = preco;
    this.tipo = tipo;

    this.getView();
  }

  selecionar() {
    const selecionado = document.querySelector(`.${this.tipo} .selecionado`);
    if (selecionado !== null) {
      selecionado.classList.remove('selecionado');
    }
    this.elemento.classList.add('selecionado');

    if (this.tipo === 'prato') {
      app.pratoSelecionado = this;
    } else if (this.tipo === 'sobremesa') {
      app.sobremesaSelecionada = this;
    } else {
      app.bebidaSelecionada = this;
    }
    app.verificarPedido();
  }

  getView() {
    const view = document.createElement('div');
    view.classList.add('opcao');
    view.addEventListener('click', () => {
      this.selecionar();
    });
    view.innerHTML = `
          <img src="${this.imagem}" />
          <div class="titulo">${this.nome}</div>
          <div class="descricao">${this.descricao}</div>
          <div class="fundo">
              <div class="preco">R$ ${this.preco.toFixed(2)}</div>
              <div class="check">
                  <ion-icon name="checkmark-circle"></ion-icon>
              </div>
          </div>
      `;
    this.elemento = view;
    document.querySelector(`.opcoes.${this.tipo}`).appendChild(view);
  }
}

class Pedido {
  constructor(prato, bebida, sobremesa) {
    this.prato = prato;
    this.bebida = bebida;
    this.sobremesa = sobremesa;
  }

  getPrecoTotal() {
    return this.prato.preco + this.bebida.preco + this.sobremesa.preco;
  }

  confirmar() {
    const modal = document.querySelector('.overlay');
    modal.classList.remove('escondido');

    document.querySelector('.confirmar-pedido .prato .nome').innerHTML =
      app.pratoSelecionado.nome;
    document.querySelector('.confirmar-pedido .prato .preco').innerHTML =
      app.pratoSelecionado.preco.toFixed(2);

    document.querySelector('.confirmar-pedido .bebida .nome').innerHTML =
      app.bebidaSelecionada.nome;
    document.querySelector('.confirmar-pedido .bebida .preco').innerHTML =
      app.bebidaSelecionada.preco.toFixed(2);

    document.querySelector('.confirmar-pedido .sobremesa .nome').innerHTML =
      app.sobremesaSelecionada.nome;
    document.querySelector('.confirmar-pedido .sobremesa .preco').innerHTML =
      app.sobremesaSelecionada.preco.toFixed(2);

    document.querySelector('.confirmar-pedido .total .preco').innerHTML =
      this.getPrecoTotal().toFixed(2);
  }

  cancelar() {
    const modal = document.querySelector('.overlay');
    modal.classList.add('escondido');
  }

  enviarZap() {
    const telefoneRestaurante = 553299999999;
    const encodedText = encodeURIComponent(
      `Olá, gostaria de fazer o pedido: \n- Prato: ${
        app.pratoSelecionado.nome
      } \n- Bebida: ${app.bebidaSelecionada.nome} \n- Sobremesa: ${
        app.sobremesaSelecionada.nome
      } \nTotal: R$ ${this.getPrecoTotal().toFixed(2)}`,
    );

    const urlWhatsapp = `https://wa.me/${telefoneRestaurante}?text=${encodedText}`;
    window.open(urlWhatsapp);
  }
}

class App {
  constructor(pratos, bebidas, sobremesas) {
    this.pratos = pratos;
    this.bebidas = bebidas;
    this.sobremesas = sobremesas;

    this.pratoSelecionado = null;
    this.bebidaSelecionada = null;
    this.sobremesaSelecionada = null;
    this.pedido = null;

    this.btnConfirmar = document.querySelector('.confirmar');
    this.btnCancelar = document.querySelector('.cancelar');
    this.btnPedir = document.querySelector('.fazer-pedido');

    this.init();
  }

  init() {
    this.pratos.forEach((prato) => {
      new Produto(prato, 'prato');
    });

    this.bebidas.forEach((bebida) => {
      new Produto(bebida, 'bebida');
    });

    this.sobremesas.forEach((sobremesa) => {
      new Produto(sobremesa, 'sobremesa');
    });

    this.btnConfirmar.addEventListener('click', () => {
      this.pedido.enviarZap();
    });

    this.btnCancelar.addEventListener('click', () => {
      this.pedido.cancelar();
    });

    this.btnPedir.addEventListener('click', () => {
      this.pedido.confirmar();
    });
  }

  verificarPedido() {
    if (
      this.pratoSelecionado !== null &&
      this.bebidaSelecionada !== null &&
      this.sobremesaSelecionada !== null
    ) {
      this.btnPedir.classList.add('ativo');
      this.btnPedir.disabled = false;
      this.btnPedir.innerHTML = 'Fazer pedido';
      this.pedido = new Pedido(
        this.pratoSelecionado,
        this.bebidaSelecionada,
        this.sobremesaSelecionada,
      );
    }
  }
}

const app = new App(pratos, bebidas, sobremesas);
