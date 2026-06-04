# HƯỚNG DẪN KẾT NỐI REACTJS VỚI BACKEND ASP.NET CORE API

Để chuyển đổi dự án từ sử dụng dữ liệu giả lập (Mock Data) sang kết nối với một Web API chạy thực tế ở Backend (ví dụ viết bằng ASP.NET Core, kết nối cơ sở dữ liệu SQL Server), bạn thực hiện theo các bước chi tiết sau:

---

## BƯỚC 1: Cấu hình Địa chỉ API ở ReactJS (Vite Environment Variables)

Thay vì viết cứng địa chỉ của server backend trong code, bạn nên sử dụng biến môi trường (Environment Variable) để dễ dàng thay đổi khi triển khai.

1. Tạo một tệp mới tên là `.env.local` ở thư mục gốc của dự án (`d:\Download\huycc\.env.local`).
2. Nhập cổng kết nối HTTPS/HTTP của Backend ASP.NET Core (Xem trong file `launchSettings.json` của dự án Backend của bạn):
   ```env
   VITE_API_BASE_URL=https://localhost:7000
   ```
3. Trong code React, bạn truy cập biến này thông qua cú pháp: `import.meta.env.VITE_API_BASE_URL`.

---

## BƯỚC 2: Cài đặt và cấu hình thư viện kết nối (Axios)

Tạo một tệp cấu hình API chung để tự động gắn Base URL vào mọi yêu cầu.
* Tạo tệp: **`src/api.js`**
* Nội dung:
  ```javascript
  import axios from 'axios';

  const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'https://localhost:7000',
    headers: {
      'Content-Type': 'application/json',
    }
  });

  export default api;
  ```

---

## BƯỚC 3: Thay thế Mock Data bằng API Call trên React

Dưới đây là ví dụ so sánh mã nguồn khi chuyển từ Mock Data sang kết nối API thực tế ở các trang:

### 1. Trang danh sách sản phẩm (`src/pages/Shop.jsx`)

* **Trước (Dùng Mock Data):**
  ```javascript
  useEffect(() => {
    if (selectedCategoryId === null) {
      setProducts(mockProducts);
    } else {
      const filtered = mockProducts.filter(p => p.categoryId === selectedCategoryId);
      setProducts(filtered);
    }
  }, [selectedCategoryId]);
  ```

* **Sau (Gọi API thực tế từ Server):**
  ```javascript
  import api from '../api'; // Import cấu hình api chung

  useEffect(() => {
    let url = '/api/products';
    if (selectedCategoryId !== null) {
      url = `/api/products/category/${selectedCategoryId}`;
    }

    api.get(url)
      .then(response => {
        setProducts(response.data); // Dữ liệu JSON từ ASP.NET Core trả về
      })
      .catch(error => {
        console.error("Lỗi lấy danh sách sản phẩm từ Backend:", error);
      });
  }, [selectedCategoryId]);
  ```

---

### 2. Trang gửi đơn đặt hàng (`src/pages/Checkout.jsx`)

* **Trước (Dùng Mock Data):**
  ```javascript
  const handleSubmitOrder = (e) => {
    e.preventDefault();
    const orderPayload = { ... };
    console.log(">>> POST /api/orders:", orderPayload);
    setOrderPlaced(true);
    clearCart();
  };
  ```

* **Sau (Gửi POST thực tế xuống Backend lưu SQL Server):**
  ```javascript
  import api from '../api';

  const handleSubmitOrder = (e) => {
    e.preventDefault();

    const orderPayload = {
      customerId: currentUser ? currentUser.id : null,
      customerName: shippingInfo.fullName,
      phone: shippingInfo.phone,
      address: shippingInfo.address,
      notes: shippingInfo.notes,
      orderDetails: cart.map(item => ({
        productId: item.id,
        quantity: item.quantity,
        price: item.price
      }))
    };

    // Gửi yêu cầu POST lên API Backend
    api.post('/api/orders', orderPayload)
      .then(response => {
        alert("Đặt hàng thành công!");
        setPlacedOrderDetails(response.data); // Lưu thông tin hóa đơn vừa tạo
        setOrderPlaced(true);
        clearCart();
      })
      .catch(error => {
        console.error("Lỗi gửi đơn đặt hàng:", error);
        alert("Không thể lưu đơn hàng. Vui lòng kiểm tra kết nối Server!");
      });
  };
  ```

---

## BƯỚC 4: Cấu hình CORS trên Backend ASP.NET Core (Rất Quan Trọng ⚠️)

Mặc định, trình duyệt web sẽ chặn các yêu cầu gọi API từ Front-end chạy ở cổng này (ReactJS: `http://localhost:5173`) đến Back-end chạy ở cổng khác (ASP.NET Core: `https://localhost:7000`) do cơ chế bảo mật Same-Origin Policy.

Để khắc phục, bạn phải cấu hình bật **CORS** trong tệp **`Program.cs`** ở dự án Backend của bạn:

```csharp
var builder = WebApplication.CreateBuilder(args);

// 1. Thêm dịch vụ CORS vào Container
builder.Services.AddCors(options =>
{
  options.AddPolicy("AllowReactApp",
    policy =>
    {
      policy.WithOrigins("http://localhost:5173") // Port mặc định của Vite ReactJS
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials(); // Bật nếu bạn cần truyền Cookie/Token tự động
    });
});

builder.Services.AddControllers();
// ...

var app = builder.Build();

// 2. Kích hoạt Middleware CORS (Phải đặt TRƯỚC app.UseAuthorization())
app.UseCors("AllowReactApp");

app.UseAuthorization();
app.MapControllers();
app.Run();
```

---

## 💡 Thứ tự kiểm tra kết nối khi chạy:

1. Chạy Backend ASP.NET Core lên trước. Truy cập đường dẫn Swagger (ví dụ: `https://localhost:7000/swagger`) để đảm bảo các API đang hoạt động bình thường.
2. Kiểm tra xem file `.env.local` của ReactJS đã trùng cổng với Backend chưa.
3. Chạy lệnh khởi chạy Front-end (`npm run dev`) và nhấn F12 chọn tab **Network** hoặc **Console** trên trình duyệt để kiểm tra xem dữ liệu có tải về thành công hay không.
