class ProductInventory extends React.Component {
  constructor() {
    super();
    this.state = {
      products: []
    };
    this.createProduct = this.createProduct.bind(this);
  }

  componentDidMount() {
    this.loadData();
  }

  async loadData() {
    // setTimeout(() => {
    //     this.setState({ products: initialproducts });
    // }, 500);
    const query = `query{
            productList {
                id category name price image
            }
        }`;
    const response = await fetch('/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query
      })
    }); // const body = await response.text();
    // const result = JSON.parse(body);

    const result = await response.json();
    this.setState({
      products: result.data.productList
    });
  }

  async createProduct(product) {
    // const newproductList = this.state.products.slice();
    // newproductList.push(product);
    // this.setState({ products: newproductList });
    // const query = `mutation {
    //     addProduct(product: {
    //         category: "${product.category}",
    //         name :"${product.name}",
    //         price :"${product.price}",
    //         image :"${product.image}",
    //     }){
    //         id
    //     }
    // }`;
    const query = `mutation addProduct($product: ProductInputs!){
            addProduct(product: $product){
                id
            }
        }`;
    const response = await fetch('/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query,
        variables: {
          product
        }
      })
    });

    if (response) {
      this.loadData();
    }
  }

  render() {
    return React.createElement(React.Fragment, null, React.createElement("h1", null, "My Company Inventory"), React.createElement(ProductTable, {
      products: this.state.products
    }), React.createElement("br", null), React.createElement(ProductAdd, {
      createProduct: this.createProduct
    }));
  }

} // const initialproducts = [
//     {
//         id:1,category: 'Shirts', name: 'Blue Shirt', price: 34.00, image:'https://vanheusen.partnerbrands.com/en/flex-regular-wrinkle-free-button-up-dress-shirt-20F6194?camp=PPC_PLA_Brand&gclid=CjwKCAiAy9jyBRA6EiwAeclQhGezscRCHA75G8pHj2ELSXM_-hKOW_3lXs_5NgqNSI-XVfo61yJkSxoCA70QAvD_BwE&gclsrc=aw.ds'
//     },
//     {
//         id: 2,category: 'Accessories', name: 'Gold Earring', price: 64.00, image:'https://www.etsy.com/listing/453173668/14k-gold-mini-hoop-earrings-14k-solid?gpla=1&gao=1&'
//     },
//     {
//         id: 3,category: 'Jackets', name: 'Sweatshirt', price: 7.98, image:'https://www.bulkapparel.com/fleece/hanes-p170-ecosmart-hooded-sweatshirt?gclid=CjwKCAiAy9jyBRA6EiwAeclQhDITTH_V5CVCRRF2IEKhrzUtmJtLPbghYO3hux6zuBv38kPfS9V7HxoCdtcQAvD_BwE'
//     }
// ];


function ProductTable(props) {
  const productRows = props.products.map((product, index) => React.createElement(ProductRow, {
    key: index,
    product: product
  }));
  return React.createElement("div", null, React.createElement("p", null, "Showing all available products"), React.createElement("hr", null), React.createElement("table", {
    className: "bordered-table"
  }, React.createElement("thead", null, React.createElement("tr", null, React.createElement("th", null, "Product Name"), React.createElement("th", null, "Price"), React.createElement("th", null, "Category"), React.createElement("th", null, "Image"))), React.createElement("tbody", null, productRows)));
}

function ProductRow(props) {
  const product = props.product;
  return React.createElement("tr", null, React.createElement("td", null, product.name), React.createElement("td", null, "$", product.price), React.createElement("td", null, product.category), React.createElement("td", null, React.createElement("a", {
    href: product.image,
    target: "_blank"
  }, "View")));
}

class ProductAdd extends React.Component {
  constructor() {
    super();
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {
      price: '$'
    };
    this.handlepriceChange = this.handlepriceChange.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    const form = document.forms.productAdd;
    const product = {
      category: form.category.value,
      price: form.price.value.replace('$', ''),
      name: form.name.value,
      image: form.image.value
    };
    this.props.createProduct(product);
    form.price.value = "$", form.name.value = "", form.image.value = "", form.category.value = "";
  }

  handlepriceChange() {
    this.setState({
      price: document.forms.productAdd.price.value
    });
  }

  render() {
    return React.createElement(React.Fragment, null, React.createElement("p", null, "Add a new product to inventory"), React.createElement("hr", null), React.createElement("form", {
      name: "productAdd",
      onSubmit: this.handleSubmit
    }, React.createElement("div", {
      className: "form-container"
    }, React.createElement("div", {
      className: "form-col"
    }, "Category", React.createElement("br", null), React.createElement("select", {
      name: "category",
      className: "category"
    }, React.createElement("option", {
      value: "shirt"
    }, "Shirts"), React.createElement("option", {
      value: "Jeans"
    }, "Jeans"), React.createElement("option", {
      value: "Jackets"
    }, "Jackets"), React.createElement("option", {
      value: "sweaters"
    }, "Sweaters"), React.createElement("option", {
      value: "accessories"
    }, "Accessories")), React.createElement("br", null), "Product Name", React.createElement("br", null), React.createElement("input", {
      type: "text",
      name: "name"
    })), React.createElement("div", {
      className: "form-col"
    }, "Price Per Unit ", React.createElement("br", null), React.createElement("input", {
      type: "text",
      name: "price",
      defaultValue: this.state.price,
      onChange: this.handlepriceChange
    }), React.createElement("br", null), "Image URL", React.createElement("br", null), React.createElement("input", {
      type: "url",
      name: "image"
    }))), React.createElement("button", null, "Add Product")));
  }

}

const element = React.createElement(ProductInventory, null);
ReactDOM.render(element, document.getElementById('contents'));