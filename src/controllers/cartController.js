import {
    addCartItem,
    getCartItemsByUser,
    removeCartItem,
    clearCartByUser
  } from '../models/cartModel.js';
  
  export const addItemToCart = async (req, res) => {
    try {
      const userId = req.user.id;
      const { productId, quantity } = req.body;
      if (!productId) {
        return res.status(400).json({ message: 'الرجاء تقديم معرّف المنتج' });
      }
      const itemId = await addCartItem(userId, productId, quantity);
      res.status(201).json({ message: 'تمت إضافة المنتج إلى السلة', itemId });
    } catch (error) {
      console.error('Error adding item to cart:', error);
      res.status(500).json({ message: 'حدث خطأ أثناء إضافة المنتج إلى السلة.' });
    }
  };
  
  export const getCartItems = async (req, res) => {
    try {
      const items = await getCartItemsByUser(req.user.id);
      res.json(items);
    } catch (error) {
      console.error('Error fetching cart items:', error);
      res.status(500).json({ message: 'حدث خطأ أثناء جلب محتويات السلة.' });
    }
  };
  
  export const deleteCartItem = async (req, res) => {
    try {
      await removeCartItem(req.params.id);
      res.json({ message: 'تم حذف المنتج من السلة' });
    } catch (error) {
      console.error('Error deleting cart item:', error);
      res.status(500).json({ message: 'حدث خطأ أثناء حذف المنتج من السلة.' });
    }
  };
  
  export const clearCart = async (req, res) => {
    try {
      await clearCartByUser(req.user.id);
      res.json({ message: 'تم مسح السلة بنجاح' });
    } catch (error) {
      console.error('Error clearing cart:', error);
      res.status(500).json({ message: 'حدث خطأ أثناء مسح السلة.' });
    }
  };
  