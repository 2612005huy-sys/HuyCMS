// Mock Data reflecting SQL Server & ASP.NET API JSON Payloads

export const mockPosts = [
  {
    id: 1,
    title: "Xu hướng thời trang Công sở nam nữ năm 2026",
    summary: "Bóc tách các thiết kế vest hiện đại, chất liệu thô thoáng mát, phom dáng thanh lịch lên ngôi trong môi trường văn phòng năng động.",
    content: "<p>Năm 2026 ghi nhận sự bùng nổ của các thiết kế công sở mang phong cách tối giản nhưng thời thượng. Các đường may sắc sảo, tone màu trung tính và chất liệu tái chế thân thiện môi trường chiếm vị trí độc tôn. Vest nam phom suông rộng và suit nữ quần ống rộng là hai điểm nhấn nổi bật không thể bỏ qua.</p>",
    date: "15 Tháng 5, 2026",
    imageUrl: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: 2,
    title: "Bí quyết chọn Đầm dạ tiệc hoàn hảo tôn dáng",
    summary: "Làm thế nào để chọn đầm dạ hội quý phái che khuyết điểm và tỏa sáng trong các sự kiện dạ tiệc tối sang trọng.",
    content: "<p>Đầm dạ hội không chỉ là trang phục, nó là tuyên ngôn cá tính của người mặc. Đối với dáng người quả táo, những thiết kế cổ chữ V khoét sâu giúp tạo điểm nhấn hướng lên trên. Đối với dáng đồng cát, đầm đuôi cá ôm sát khoe trọn đường cong là sự lựa chọn tối ưu.</p>",
    date: "22 Tháng 5, 2026",
    imageUrl: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: 3,
    title: "Nghệ thuật mặc suit nam chuẩn mực Âu phục",
    summary: "Cách phối đồ, chọn cà vạt, giày tây và ve áo phù hợp để tạo nên hình tượng quý ông lịch lãm trong mọi sự kiện quan trọng.",
    content: "<p>Một bộ suit vừa vặn (tailored-fit) có thể thay đổi hoàn toàn diện mạo của nam giới. Hãy chú ý đến chiều dài vai, tay áo sơ mi thò ra khoảng 1-2cm so với tay áo vest và cúc áo cuối cùng không bao giờ được cài.</p>",
    date: "28 Tháng 5, 2026",
    imageUrl: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=600&auto=format&fit=crop"
  }
];

export const mockCategories = [
  { id: 1, name: "Thời trang Công sở Nữ" },
  { id: 2, name: "Đầm Dạ hội Quý phái" },
  { id: 3, name: "Vest & Âu phục Nam" }
];

export const mockProducts = [
  // Category 1: Thời trang Công sở Nữ
  {
    id: 101,
    categoryId: 1,
    name: "Áo Blazer Công Sở Dáng Suông Màu Kem",
    price: 650000,
    imageUrl: "https://images.unsplash.com/photo-1548624313-0396c75e4b1a?q=80&w=500&auto=format&fit=crop",
    description: "Áo Blazer công sở được may từ chất liệu vải tuyết mưa cao cấp, đứng phom và ít nhăn. Thiết kế dáng suông hiện đại phù hợp mặc đi làm hằng ngày hoặc hội họp sang trọng.\n- Thành phần: 70% Polyester, 30% Rayon.\n- Hướng dẫn giặt: Giặt hấp hoặc giặt tay nước ấm.",
    stockQuantity: 24
  },
  {
    id: 102,
    categoryId: 1,
    name: "Quần Tây Nữ Ống Suông Lưng Cao",
    price: 420000,
    imageUrl: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=500&auto=format&fit=crop",
    description: "Quần tây ống suông hack dáng tối đa cho các nàng công sở. Thiết kế cạp cao giấu bụng cực tốt kết hợp đỉa quần bản to sành điệu.",
    stockQuantity: 15
  },
  {
    id: 103,
    categoryId: 1,
    name: "Sơ mi Lụa Satin Tay Dài Cổ Đức",
    price: 380000,
    imageUrl: "https://images.unsplash.com/photo-1603252109303-2751441dd157?q=80&w=500&auto=format&fit=crop",
    description: "Sơ mi lụa mềm mại tạo cảm giác nhẹ nhàng, dễ chịu suốt ngày dài làm việc. Tone màu pastel thời thượng tôn da.",
    stockQuantity: 8
  },

  // Category 2: Đầm Dạ hội Quý phái
  {
    id: 201,
    categoryId: 2,
    name: "Đầm Dạ Hội Đuôi Cá Trễ Vai Quyến Rũ",
    price: 1850000,
    imageUrl: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=500&auto=format&fit=crop",
    description: "Mẫu đầm dạ hội đuôi cá sang trọng lấp lánh giúp bạn chiếm trọn spotlight tại các bữa tiệc. Phần vai trễ tôn trọn xương quai xanh thanh mảnh.\n- Chất liệu: Kim sa cao cấp lót thun cotton co giãn mềm mại.\n- Chiều dài: 145cm.",
    stockQuantity: 5
  },
  {
    id: 202,
    categoryId: 2,
    name: "Đầm Xòe Dạ Hội Cổ V Phối Ren Luxury",
    price: 1490000,
    imageUrl: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=500&auto=format&fit=crop",
    description: "Đầm xòe bồng bềnh công chúa chất liệu tơ Organza đính kết ren ngực tinh xảo. Phù hợp cho dạ tiệc ngoài trời hoặc tiệc cưới sang trọng.",
    stockQuantity: 0 // Hết hàng để test logic hiển thị stockQuantity === 0
  },

  // Category 3: Vest & Âu phục Nam
  {
    id: 301,
    categoryId: 3,
    name: "Bộ Suit Nam Slimfit Màu Xanh Navy",
    price: 2450000,
    imageUrl: "https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?q=80&w=500&auto=format&fit=crop",
    description: "Bộ suit bao gồm 1 áo vest và 1 quần tây đồng điệu. Phom dáng Slimfit trẻ trung ôm vừa vặn cơ thể quý ông.\n- Chất liệu: Vải cashmere mềm mịn, co giãn nhẹ và giữ phom tốt.",
    stockQuantity: 10
  },
  {
    id: 302,
    categoryId: 3,
    name: "Áo Vest Nam Double-Breasted Khuy Kép Cổ Điển",
    price: 1650000,
    imageUrl: "https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=500&auto=format&fit=crop",
    description: "Áo vest 6 khuy (Double-Breasted) mang đậm tinh thần quý tộc Anh Quốc cổ điển. Thích hợp phối cùng áo len cổ lọ hoặc sơ mi trắng cà vạt.",
    stockQuantity: 12
  }
];

export const mockCustomer = {
  id: 902,
  name: "Lê Ngọc Mai",
  email: "maile@gmail.com",
  phone: "0987654321",
  address: "123 Đường Nguyễn Trãi, Phường 2, Quận 5, TP. Hồ Chí Minh"
};
