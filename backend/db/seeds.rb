# Seeds for Bazar-Bio E-Commerce Platform (Yaoundé, Cameroon)

puts "🌱 Seeding database for Bazar-Bio..."

# 1. Currencies
xaf = Currency.find_or_create_by!(code: "XAF") do |c|
  c.name = "Franc CFA"
  c.symbol = "FCFA"
  c.exchange_rate = 1.0
end

# 2. Country & Geography
cameroun = Country.find_or_create_by!(code: "CM") do |c|
  c.name = "Cameroun"
  c.phone_code = "+237"
  c.currency = xaf
end

centre = Region.find_or_create_by!(country: cameroun, name: "Centre") do |r|
  r.code = "CE"
end

yaounde = City.find_or_create_by!(region: centre, name: "Yaoundé")

# 3. Delivery Zones (Yaoundé Neighborhoods)
delivery_zones_data = [
  { name: "Bastos", fee: 1500.00 },
  { name: "Odza", fee: 2000.00 },
  { name: "Omnisports", fee: 1200.00 },
  { name: "Mendong", fee: 1500.00 },
  { name: "Mvan", fee: 1800.00 },
  { name: "Biyem-Assi", fee: 1500.00 },
  { name: "Melen", fee: 1000.00 },
  { name: "Ekounou", fee: 1500.00 },
  { name: "Nsimeyong", fee: 1500.00 },
  { name: "Santa Barbara", fee: 1500.00 }
]

delivery_zones_data.each do |zone|
  DeliveryZone.find_or_create_by!(city: yaounde, name: zone[:name]) do |z|
    z.delivery_fee = zone[:fee]
    z.is_active = true
  end
end

# 4. Units
unit_kg = Unit.find_or_create_by!(abbreviation: "kg") { |u| u.name = "Kilogramme" }
unit_botte = Unit.find_or_create_by!(abbreviation: "botte") { |u| u.name = "Botte" }
unit_paquet = Unit.find_or_create_by!(abbreviation: "paquet") { |u| u.name = "Paquet" }
unit_pc = Unit.find_or_create_by!(abbreviation: "pc") { |u| u.name = "Pièce" }

# 5. Seasons
season_all = Season.find_or_create_by!(code: "all_year") { |s| s.name = "Toute l'année"; s.is_active = true }
season_rainy = Season.find_or_create_by!(code: "rainy_season") { |s| s.name = "Saison des pluies"; s.is_active = true }
season_dry = Season.find_or_create_by!(code: "dry_season") { |s| s.name = "Grande saison sèche"; s.is_active = true }

# 6. Payment Methods
PaymentMethod.find_or_create_by!(code: "mtn_momo") { |p| p.name = "MTN Mobile Money"; p.is_active = true }
PaymentMethod.find_or_create_by!(code: "orange_momo") { |p| p.name = "Orange Money"; p.is_active = true }
PaymentMethod.find_or_create_by!(code: "cash_on_delivery") { |p| p.name = "Paiement à la livraison"; p.is_active = true }

# 7. Order Statuses
%w[pending confirmed preparing out_for_delivery delivered cancelled].each do |status_code|
  OrderStatus.find_or_create_by!(code: status_code) do |s|
    s.name = status_code.humanize
  end
end

# 8. Categories
cat_legumes = Category.find_or_create_by!(slug: "legumes-bio") do |c|
  c.name = "Légumes Bio"
  c.description = "Légumes frais 100% naturels sans engrais chimiques."
end

cat_fruits = Category.find_or_create_by!(slug: "fruits-de-saison") do |c|
  c.name = "Fruits de Saison"
  c.description = "Fruits récoltés à maturité naturelle dans les vergers locaux."
end

cat_epices = Category.find_or_create_by!(slug: "epices-et-aromates") do |c|
  c.name = "Épices & Aromates"
  c.description = "Herbes fines et condiments biologiques."
end

cat_bijoux = Category.find_or_create_by!(slug: "bijoux-artisanaux") do |c|
  c.name = "Bijoux Artisanaux"
  c.description = "Créations originales façonnées à la main par des artisans camerounais."
end

# 9. Artisans
artisan_jeanne = Artisan.find_or_create_by!(name: "Mama Jeanne") do |a|
  a.city = yaounde
  a.bio = "Tisseuse traditionnelle de perles d'Afrique de l'Ouest et Bamiléké depuis plus de 20 ans."
  a.profile_image_url = "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80"
end

artisan_mbele = Artisan.find_or_create_by!(name: "Papa Mbele") do |a|
  a.city = yaounde
  a.bio = "Maître sculpteur et bronzeur originaire de la cité artisanale de Foumban."
  a.profile_image_url = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80"
end

# 10. Products
products_data = [
  {
    name: "Tomates Bio de Obala",
    category: cat_legumes,
    unit: unit_kg,
    season: season_all,
    origin_city: yaounde,
    price: 1500.00,
    type: "produce",
    stock_quantity: 45,
    description: "Tomates charnues et juteuses cultivées sans aucun pesticide synthétique.",
    image_url: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Poivrons Verts & Rouges Bio",
    category: cat_legumes,
    unit: unit_kg,
    season: season_rainy,
    origin_city: yaounde,
    price: 1200.00,
    type: "produce",
    stock_quantity: 30,
    description: "Poivrons croquants parfaits pour assaisonner vos plats d'exception.",
    image_url: "https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Foléré (Bissap Bio)",
    category: cat_epices,
    unit: unit_paquet,
    season: season_all,
    origin_city: yaounde,
    price: 800.00,
    type: "produce",
    stock_quantity: 60,
    description: "Fleurs d'hibiscus séchées biologiquement, idéales pour jus rafraîchissant et infusions.",
    image_url: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Ananas Doux de Penja",
    category: cat_fruits,
    unit: unit_pc,
    season: season_dry,
    origin_city: yaounde,
    price: 1000.00,
    type: "produce",
    stock_quantity: 25,
    description: "Ananas naturellement sucré et très aromatique, récolté à maturité.",
    image_url: "https://images.unsplash.com/photo-1550258987-190a2d41a8ba?auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Plantains Mûrs du Moungo",
    category: cat_fruits,
    unit: unit_botte,
    season: season_all,
    origin_city: yaounde,
    price: 2500.00,
    type: "produce",
    stock_quantity: 20,
    description: "Régime de plantains dorés parfaits pour vos alloco et pilés.",
    image_url: "https://images.unsplash.com/photo-1528825871115-3581a5387919?auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Collier Royal en Perles Bamiléké",
    category: cat_bijoux,
    unit: unit_pc,
    season: season_all,
    origin_city: yaounde,
    artisan: artisan_jeanne,
    price: 18500.00,
    type: "jewelry",
    stock_quantity: 5,
    description: "Magnifique sautoir tissé main avec des perles d'enfilage traditionnelles aux motifs royaux.",
    image_url: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Bracelet Artisanal en Bronze Foumban",
    category: cat_bijoux,
    unit: unit_pc,
    season: season_all,
    origin_city: yaounde,
    artisan: artisan_mbele,
    price: 12000.00,
    type: "jewelry",
    stock_quantity: 8,
    description: "Bracelet rigide gravé au marteau par les artisans fondeurs de la cité royale de Foumban.",
    image_url: "https://images.unsplash.com/photo-1611591475143-be232935f458?auto=format&fit=crop&w=800&q=80"
  }
]

products_data.each do |p_data|
  Product.find_or_create_by!(name: p_data[:name]) do |p|
    p.category = p_data[:category]
    p.unit = p_data[:unit]
    p.season = p_data[:season]
    p.origin_city = p_data[:origin_city]
    p.artisan = p_data[:artisan] if p_data[:artisan]
    p.price = p_data[:price]
    p.product_type = p_data[:type]
    p.stock_quantity = p_data[:stock_quantity]
    p.description = p_data[:description]
    p.image_url = p_data[:image_url]
    p.is_active = true
  end
end

puts "✅ Seeding completed! Created #{Product.count} products, #{DeliveryZone.count} delivery zones, and #{Category.count} categories."
