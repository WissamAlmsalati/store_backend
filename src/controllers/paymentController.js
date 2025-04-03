import {
    createPayment,
    getPaymentById,
    updatePaymentStatus,
    deletePayment
  } from '../models/paymentModel.js';
  
  export const makePayment = async (req, res) => {
    try {
      const { orderId, payment_method } = req.body;
      if (!orderId || !payment_method) {
        return res.status(400).json({ message: 'الرجاء تقديم بيانات الدفع المطلوبة' });
      }
      const paymentId = await createPayment(orderId, payment_method);
      res.status(201).json({ message: 'تم إنشاء الدفع بنجاح', paymentId });
    } catch (error) {
      console.error('Error creating payment:', error);
      res.status(500).json({ message: 'حدث خطأ أثناء إنشاء الدفع.' });
    }
  };
  
  export const getPayment = async (req, res) => {
    try {
      const payment = await getPaymentById(req.params.id);
      if (!payment) {
        return res.status(404).json({ message: 'لم يتم العثور على بيانات الدفع' });
      }
      res.json(payment);
    } catch (error) {
      console.error('Error fetching payment:', error);
      res.status(500).json({ message: 'حدث خطأ أثناء جلب بيانات الدفع.' });
    }
  };
  
  export const changePaymentStatus = async (req, res) => {
    try {
      const { status } = req.body;
      await updatePaymentStatus(req.params.id, status);
      res.json({ message: 'تم تحديث حالة الدفع بنجاح' });
    } catch (error) {
      console.error('Error updating payment status:', error);
      res.status(500).json({ message: 'حدث خطأ أثناء تحديث حالة الدفع.' });
    }
  };
  
  export const removePayment = async (req, res) => {
    try {
      await deletePayment(req.params.id);
      res.json({ message: 'تم حذف بيانات الدفع بنجاح' });
    } catch (error) {
      console.error('Error deleting payment:', error);
      res.status(500).json({ message: 'حدث خطأ أثناء حذف بيانات الدفع.' });
    }
  };
  