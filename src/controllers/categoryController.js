import {
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory
  } from '../models/categoryModel.js';
  
  export const listCategories = async (req, res) => {
    try {
      const categories = await getAllCategories();
      res.json(categories);
    } catch (error) {
      console.error('Error fetching categories:', error);
      res.status(500).json({ message: 'حدث خطأ أثناء جلب التصنيفات.' });
    }
  };
  
  export const getCategory = async (req, res) => {
    try {
      const category = await getCategoryById(req.params.id);
      if (!category) {
        return res.status(404).json({ message: 'لم يتم العثور على التصنيف' });
      }
      res.json(category);
    } catch (error) {
      console.error('Error fetching category:', error);
      res.status(500).json({ message: 'حدث خطأ أثناء جلب التصنيف.' });
    }
  };
  
  export const addCategory = async (req, res) => {
    try {
      const { name } = req.body;
      if (!name) {
        return res.status(400).json({ message: 'الرجاء تقديم اسم التصنيف' });
      }
      const categoryId = await createCategory(name);
      res.status(201).json({ message: 'تمت إضافة التصنيف بنجاح', categoryId });
    } catch (error) {
      console.error('Error adding category:', error);
      res.status(500).json({ message: 'حدث خطأ أثناء إضافة التصنيف.' });
    }
  };
  
  export const updateCategoryDetails = async (req, res) => {
    try {
      const { name } = req.body;
      await updateCategory(req.params.id, name);
      res.json({ message: 'تم تحديث التصنيف بنجاح' });
    } catch (error) {
      console.error('Error updating category:', error);
      res.status(500).json({ message: 'حدث خطأ أثناء تحديث التصنيف.' });
    }
  };
  
  export const removeCategory = async (req, res) => {
    try {
      await deleteCategory(req.params.id);
      res.json({ message: 'تم حذف التصنيف بنجاح' });
    } catch (error) {
      console.error('Error deleting category:', error);
      res.status(500).json({ message: 'حدث خطأ أثناء حذف التصنيف.' });
    }
  };
  