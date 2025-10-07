// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function buildProjectFormData(data: any) {
  const formData = new FormData();

  // 1️⃣ Tách file thumbnail ra
  if (data.thumbnail) {
    formData.append("thumbnail", data.thumbnail);
  }

  // 2️⃣ Gom toàn bộ dữ liệu còn lại vào payload JSON
  // (chỉ giữ các phần không phải file)
  const {
    listSections = [],
    dataTienIch = [],
    dataThuVienHinhAnh = [],
    ...rest
  } = data;

  // Chuẩn hóa dữ liệu: chỉ giữ key imageKey, không giữ file thật trong object
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const cleanSections = listSections.map((item: any) => ({
    orderIndex: item.orderIndex,
    type: item.type,
    content: item.content,
    imageKey: item.imageKey,
  }));

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const cleanTienIch = dataTienIch.map((item: any) => ({
    type: item.type,
    description: item.description || item.decription,
    orderIndex: item.orderIndex,
    imageKey: item.imageKey,
  }));

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const cleanThuVien = dataThuVienHinhAnh.map((item: any) => ({
    type: item.type,
    description: item.description || item.decription,
    orderIndex: item.orderIndex,
    imageKey: item.imageKey,
  }));

  const payload = {
    ...rest,
    listSections: cleanSections,
    dataTienIch: cleanTienIch,
    dataThuVienHinhAnh: cleanThuVien,
  };

  formData.append("payload", JSON.stringify(payload));

  // section images
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  listSections.forEach((item: any) => {
    if (item.image && item.imageKey) {
      formData.append(item.imageKey, item.image);
    }
  });

  // tiện ích images
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dataTienIch.forEach((item: any) => {
    if (item.image && item.imageKey) {
      formData.append(item.imageKey, item.image);
    }
  });

  // thư viện images
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dataThuVienHinhAnh.forEach((item: any) => {
    if (item.image && item.imageKey) {
      formData.append(item.imageKey, item.image);
    }
  });

  return formData;
}
