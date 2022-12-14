import { useEffect, useState } from "react";
import { ActivityIndicator } from "react-native";
import Header from "../components/Header";
import Button from "../components/Button";
import Categories from "../components/Categories";
import Menu from "../components/Menu";
import TableModal from "../components/TableModal";
import Cart from "../components/Cart";
import {
  Container,
  CategoriesContainer,
  MenuContainer,
  Footer,
  FooterContainer,
	CenteredContainer,
} from "./styles";
import { CartItem } from "../types/cartItem";
import { Product } from "../types/Product";
import { Empty } from "../components/Icons/Empty";
import { Text } from "../components/Text";
import { Category } from "../types/Category";
import { api } from "../utils/api";

const Main = () => {
  const [isTableModalVisible, setIsTableModalVisible] = useState(false);
  const [selectedTable, setSelectedTable] = useState("");
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
	const [controlResquestLoading, setControlRequestLoading] = useState(false)
	const [products, setProducts] = useState<Product[]>([])
	const [categories, setCategories] = useState<Category[]>([])

	useEffect(() => {
		Promise.all([
			api.get(`/categories`),
			api.get(`/products`)

		]).then(([categoriesReq, productsReq]) => {
			setCategories(categoriesReq.data)
			setProducts(productsReq.data)
			setIsLoading(false)
		})
	}, [])

	//listar categoria de produtos
	const handleSelecteCategory = async (categoryId: string) => {
		//verificar se não houver id ele lista os produtos, caso haja retorna toda a lista
		const route = !categoryId ? '/products' : `/categories/${categoryId}/products`

		setControlRequestLoading(true)
		const { data } = await api.get(route)
		setProducts(data)
		setControlRequestLoading(false)
	}

  const handleSaveTable = (table: string) => {
    setSelectedTable(table);
  };

  const handleResetOrder = () => {
    setSelectedTable("");
    setCartItems([]);
  };

  const handleAddToCart = (product: Product) => {
    if (!selectedTable) {
      setIsTableModalVisible(true);
    }

    setCartItems((prevState) => {
      const itemIndex = prevState.findIndex(
        (cartItem) => cartItem.product._id === product._id
      );

      if (itemIndex < 0) {
        return prevState.concat({
          quantity: 1,
          product,
        });
      }

      const newCartItems = [...prevState];
      const item = newCartItems[itemIndex];
      newCartItems[itemIndex] = {
        ...item,
        quantity: item.quantity + 1,
      };

      return newCartItems;
    });
  };

  const handleDecreaseCartItem = (product: Product) => {
    setCartItems((prevState) => {
      const itemIndex = prevState.findIndex(
        (cartItem) => cartItem.product._id === product._id
      );
      const item = prevState[itemIndex];
      const newCartItems = [...prevState];

      if (item.quantity === 1) {
        newCartItems.splice(itemIndex, 1); //de ela, para ela mesma

        return newCartItems;
      }

      newCartItems[itemIndex] = {
        ...item,
        quantity: item.quantity - 1,
      };

      return newCartItems;
    });
  };

  return (
    <>
      <Container>
        <Header
          selectedTable={selectedTable}
          onCancelOrder={handleResetOrder}
        />
				{isLoading && (
					<CenteredContainer>
						<ActivityIndicator color="#d73035" size="large"/>
					</CenteredContainer>
				)}
        {!isLoading && (
          <>
            <CategoriesContainer>
              <Categories
								onSelectCategoty={handleSelecteCategory}
								categories={categories}
							/>
            </CategoriesContainer>

						{/* criando loading para cardapio */}
						{controlResquestLoading ? (
							<CenteredContainer>
								<ActivityIndicator color="#d73035" size="large"/>
							</CenteredContainer>
						) : (
							<>
								{products.length > 0 ? (
									<MenuContainer>
										<Menu
											products={products}
											onAddToCart={handleAddToCart}
										/>
									</MenuContainer>
								): (
									<CenteredContainer>
										<Empty />
										<Text color="#666" style={{ marginTop: 24 }}>Nenhum produto foi encontrado</Text>
									</CenteredContainer>
								)}
							</>
						)}
          </>
        )}
      </Container>
      {/* configuracao do footer para IOS */}
      <Footer>
        <FooterContainer>
          {!selectedTable && (
            <Button
							disabled={isLoading}
							onPress={() => setIsTableModalVisible(true)}
						>
              Novo Pedido
            </Button>
          )}

          {selectedTable && (
            <Cart
							selectedTable={selectedTable}
              onAdd={handleAddToCart}
              onRemove={handleDecreaseCartItem}
              cartItems={cartItems}
              onConfirmOrder={handleResetOrder}
            />
          )}
        </FooterContainer>
      </Footer>

      <TableModal
        onClose={() => setIsTableModalVisible(false)}
        visible={isTableModalVisible}
        //essa funcao pode ser compartilhada entre componentes
        onSave={handleSaveTable}
      />
    </>
  );
};

export default Main;
