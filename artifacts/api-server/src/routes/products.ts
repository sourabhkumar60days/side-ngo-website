import { Router, type IRouter } from "express";
import { db, productsTable, productCategoriesTable, insertProductSchema, insertProductCategorySchema } from "@workspace/db";
import { eq } from "drizzle-orm";
import { deleteCloudinaryImages } from "../cloudinaryService.js";

const router: IRouter = Router();

router.get("/categories", async (req, res) => {
  try {
    const categories = await db.select().from(productCategoriesTable);
    res.json(categories);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to fetch categories" });
  }
});

router.post("/categories", async (req, res) => {
  try {
    const parsed = insertProductCategorySchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Invalid category data", details: parsed.error });
      return;
    }
    const [category] = await db.insert(productCategoriesTable).values(parsed.data).returning();
    res.status(201).json(category);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to create category" });
  }
});

router.put("/categories/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const parsed = insertProductCategorySchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Invalid category data", details: parsed.error });
      return;
    }
    const [category] = await db.update(productCategoriesTable).set(parsed.data).where(eq(productCategoriesTable.id, id)).returning();
    if (!category) {
      res.status(404).json({ error: "Category not found" });
      return;
    }
    res.json(category);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to update category" });
  }
});

router.delete("/categories/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await db.update(productsTable).set({ categoryId: null }).where(eq(productsTable.categoryId, id));
    await db.delete(productCategoriesTable).where(eq(productCategoriesTable.id, id));
    res.status(204).send();
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to delete category" });
  }
});

router.get("/", async (req, res) => {
  try {
    const categoryId = req.query.categoryId ? parseInt(req.query.categoryId as string) : undefined;

    const result = await db
      .select({
        id: productsTable.id,
        name: productsTable.name,
        price: productsTable.price,
        description: productsTable.description,
        imageUrl: productsTable.imageUrl,
        categoryId: productsTable.categoryId,
        categoryName: productCategoriesTable.name,
        inStock: productsTable.inStock,
        discount: productsTable.discount,
      })
      .from(productsTable)
      .leftJoin(productCategoriesTable, eq(productsTable.categoryId, productCategoriesTable.id))
      .where(categoryId ? eq(productsTable.categoryId, categoryId) : undefined);

    res.json(result);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

router.post("/", async (req, res) => {
  try {
    const parsed = insertProductSchema.safeParse({ ...req.body, price: String(req.body.price ?? "") });
    if (!parsed.success) {
      res.status(400).json({ error: "Invalid product data", details: parsed.error });
      return;
    }
    const [product] = await db.insert(productsTable).values(parsed.data).returning();
    const [full] = await db.select({
      id: productsTable.id,
      name: productsTable.name,
      price: productsTable.price,
      description: productsTable.description,
      imageUrl: productsTable.imageUrl,
      categoryId: productsTable.categoryId,
      categoryName: productCategoriesTable.name,
      inStock: productsTable.inStock,
      discount: productsTable.discount,
    }).from(productsTable).leftJoin(productCategoriesTable, eq(productsTable.categoryId, productCategoriesTable.id)).where(eq(productsTable.id, product.id));
    res.status(201).json(full);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to create product" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const parsed = insertProductSchema.safeParse({ ...req.body, price: String(req.body.price ?? "") });
    if (!parsed.success) {
      res.status(400).json({ error: "Invalid product data", details: parsed.error });
      return;
    }

    const [existing] = await db.select().from(productsTable).where(eq(productsTable.id, id));
    if (!existing) {
      res.status(404).json({ error: "Product not found" });
      return;
    }

    const oldUrls = (existing.imageUrl || "").split(",").map(u => u.trim()).filter(Boolean);
    const newUrls = (parsed.data.imageUrl || "").split(",").map(u => u.trim()).filter(Boolean);
    const removedUrls = oldUrls.filter(u => !newUrls.includes(u));
    if (removedUrls.length > 0) {
      await deleteCloudinaryImages(removedUrls);
    }

    await db.update(productsTable).set(parsed.data).where(eq(productsTable.id, id));
    const [full] = await db.select({
      id: productsTable.id,
      name: productsTable.name,
      price: productsTable.price,
      description: productsTable.description,
      imageUrl: productsTable.imageUrl,
      categoryId: productsTable.categoryId,
      categoryName: productCategoriesTable.name,
      inStock: productsTable.inStock,
      discount: productsTable.discount,
    }).from(productsTable).leftJoin(productCategoriesTable, eq(productsTable.categoryId, productCategoriesTable.id)).where(eq(productsTable.id, id));
    if (!full) {
      res.status(404).json({ error: "Product not found" });
      return;
    }
    res.json(full);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to update product" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const [existing] = await db.select().from(productsTable).where(eq(productsTable.id, id));
    if (existing?.imageUrl) {
      await deleteCloudinaryImages(existing.imageUrl);
    }
    await db.delete(productsTable).where(eq(productsTable.id, id));
    res.status(204).send();
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to delete product" });
  }
});

export default router;
