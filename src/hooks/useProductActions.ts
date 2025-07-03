export const useProductActions = () => {
  const handleShare = () => {
    // 공유 로직
    console.log('공유하기');
  };

  const handleAddToCart = () => {
    // 장바구니 추가 로직
    console.log('장바구니 추가');
  };

  const handleBuyNow = () => {
    // 바로구매 로직
    console.log('바로구매');
  };

  const handlePurchase = () => {
    // 구매 로직
    console.log('구매 완료');
  };

  return {
    handleShare,
    handleAddToCart,
    handleBuyNow,
    handlePurchase,
  };
};
