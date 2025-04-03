import {
    createOrder,
    getOrderById,
    getOrdersByUser,
    updateOrderStatus,
    deleteOrder
  } from '../models/orderModel.js';
  
  export const placeOrder = async (req, res) => {
    try {
      const { totalPrice } = req.body;
      const userId = req.user.id; // Assuming req.user is set by verifyUser middleware
      if (!totalPrice) {
        return res.status(400).json({ message: 'الرجاء تقديم إجمالي السعر' });
      }
      const orderId = await createOrder(userId, totalPrice);
      res.status(201).json({ message: 'تم إنشاء الطلب بنجاح', orderId });
    } catch (error) {
      console.error('Error placing order:', error);
      res.status(500).json({ message: 'حدث خطأ أثناء إنشاء الطلب.' });
    }
  };
  
  export const getOrder = async (req, res) => {
    try {
      const order = await getOrderById(req.params.id);
      if (!order) {
        return res.status(404).json({ message: 'لم يتم العثور على الطلب' });
      }
      res.json(order);
    } catch (error) {
      console.error('Error fetching order:', error);
      res.status(500).json({ message: 'حدث خطأ أثناء جلب الطلب.' });
    }
  };
  
  export const listUserOrders = async (req, res) => {
    try {
      const orders = await getOrdersByUser(req.user.id);
      res.json(orders);
    } catch (error) {
      console.error('Error fetching orders:', error);
      res.status(500).json({ message: 'حدث خطأ أثناء جلب الطلبات.' });
    }
  };
  
  export const changeOrderStatus = async (req, res) => {
    try {
      const { status } = req.body;
      await updateOrderStatus(req.params.id, status);
      res.json({ message: 'تم تحديث حالة الطلب بنجاح' });
    } catch (error) {
      console.error('Error updating order status:', error);
      res.status(500).json({ message: 'حدث خطأ أثناء تحديث حالة الطلب.' });
    }
  };
  
  export const cancelOrder = async (req, res) => {
    try {
      await deleteOrder(req.params.id);
      res.json({ message: 'تم حذف الطلب بنجاح' });
    } catch (error) {
      console.error('Error deleting order:', error);
      res.status(500).json({ message: 'حدث خطأ أثناء حذف الطلب.' });
    }
  };
  