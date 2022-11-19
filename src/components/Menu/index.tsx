import { FlatList } from "react-native";
import { Text } from "../Text";
import { products } from "../../mocks/products";
import {
  ProductContainer,
  ProductImage,
  ProductDetails,
  Separator,
  AddToCartButton,
} from "./styles";
import { formatCurrency } from "../../utils/formatCurrency";
import { PlusCircle } from "../Icons/PlusCircle";
import ProductModal from "../ProductModal";
import { useState } from "react";
import { Product } from "../../types/Product";

const Menu = () => {
	const [isModalVisible, setIsModalVisible] = useState(false)
	const [selectedProduct, setSelectedProduct] = useState< null | Product>(null)

	const handleOpenModal = (product: Product) => {
		setIsModalVisible(true)
		setSelectedProduct(product)

	}

  return (
    <>
			<ProductModal
				visible={isModalVisible}
				product={selectedProduct}
				//setando para IOS
				onClose={() => setIsModalVisible(false)}
			/>

      <FlatList
        data={products}
        keyExtractor={(product) => product._id}
        style={{ marginTop: 32 }}
        contentContainerStyle={{ paddingHorizontal: 24 }}
        ItemSeparatorComponent={Separator}
        renderItem={({ item: product }) => (
          <ProductContainer onPress={() => handleOpenModal(product)}>
            <ProductImage
              source={{
                uri: `http://192.168.1.7:3008/uploads/${product.imagePath}`,
              }}
            />
            <ProductDetails>
              <Text weight="600">{product.name}</Text>
              <Text size={14} color="#666">
                {product.description}
              </Text>
              <Text
                weight="600"
                size={14}
                color="#333"
                style={{ marginVertical: 8 }}
              >
                {formatCurrency(product.price)}
              </Text>
            </ProductDetails>

            <AddToCartButton>
              <PlusCircle />
            </AddToCartButton>
          </ProductContainer>
        )}
      />
    </>
  );
};

export default Menu;
