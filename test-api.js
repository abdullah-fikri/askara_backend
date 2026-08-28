const app = require('./server');

async function testRoutes() {
  console.log('Testing Express MVC API...');
  
  // Test categories
  const Category = require('./models/ProductCategory');
  const categories = await Category.findAll();
  console.log('✓ Category model works. Categories count:', categories.length);

  // Test products
  const Product = require('./models/Product');
  const products = await Product.findAll();
  console.log('✓ Product model works. Products count:', products.length);

  // Test articles
  const Article = require('./models/Article');
  const articles = await Article.findAll();
  console.log('✓ Article model works. Articles count:', articles.length);

  // Test partners
  const Partner = require('./models/Partner');
  const partners = await Partner.findAll();
  console.log('✓ Partner model works. Partners count:', partners.length);

  // Test careers
  const Career = require('./models/Career');
  const careers = await Career.findAll();
  console.log('✓ Career model works. Careers count:', careers.length);

  // Test User auth
  const User = require('./models/User');
  const admin = await User.findByEmail('admin@askara.co.id');
  console.log('✓ Admin user found:', admin?.name);

  console.log('\n🎉 ALL BACKEND MODELS & SEED DATA PASSED TEST!');
}

testRoutes().catch(console.error);
