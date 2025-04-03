import {
    addAddress,
    getAddressesByUser,
    updateAddress,
    deleteAddress
  } from '../models/addressModel.js';
  
  export const createAddress = async (req, res) => {
    try {
      const userId = req.user.id;
      const { address, city, country, postal_code } = req.body;
      if (!address || !city || !country) {
        return res.status(400).json({ message: 'الرجاء تقديم جميع بيانات العنوان المطلوبة' });
      }
      const addressId = await addAddress(userId, address, city, country, postal_code);
      res.status(201).json({ message: 'تمت إضافة العنوان بنجاح', addressId });
    } catch (error) {
      console.error('Error adding address:', error);
      res.status(500).json({ message: 'حدث خطأ أثناء إضافة العنوان.' });
    }
  };
  
  export const listAddresses = async (req, res) => {
    try {
      const addresses = await getAddressesByUser(req.user.id);
      res.json(addresses);
    } catch (error) {
      console.error('Error fetching addresses:', error);
      res.status(500).json({ message: 'حدث خطأ أثناء جلب العناوين.' });
    }
  };
  
  export const updateAddressDetails = async (req, res) => {
    try {
      const { address, city, country, postal_code } = req.body;
      await updateAddress(req.params.id, address, city, country, postal_code);
      res.json({ message: 'تم تحديث العنوان بنجاح' });
    } catch (error) {
      console.error('Error updating address:', error);
      res.status(500).json({ message: 'حدث خطأ أثناء تحديث العنوان.' });
    }
  };
  
  export const removeAddress = async (req, res) => {
    try {
      await deleteAddress(req.params.id);
      res.json({ message: 'تم حذف العنوان بنجاح' });
    } catch (error) {
      console.error('Error deleting address:', error);
      res.status(500).json({ message: 'حدث خطأ أثناء حذف العنوان.' });
    }
  };
  