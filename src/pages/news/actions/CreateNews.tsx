import { Button, Image, Input, Switch } from "antd"
import { useState } from "react";
import ClockIcon from "../../../assets/icons/ClockIcon";
import NewsSection from "../news-section";
import PlusIcon from "../../../assets/icons/PlusIcon";
import type { NewsSectionEntity } from "../../../entities/news";
import { Editor } from "@tinymce/tinymce-react";
import MinusIcon from "../../../assets/icons/MinusIcon";
import { createNews } from "../../../services/news";

function CreateNews() {

  const [isHotNews, setIsHotNews] = useState(false);
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [thumbnail, setThumbnail] = useState<File | null>(null)
  const [listSections, setListSections] = useState<NewsSectionEntity[]>([]);

  const date = new Date();
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  const onSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('summary', summary);
      formData.append("isHotNews", isHotNews ? "true" : "false");
      if (thumbnail) {
        formData.append("thumbnail", thumbnail);
      }
      listSections.forEach((s, i) => {
        formData.append(`section_${i}`, JSON.stringify({
          orderIndex: s.orderIndex,
          caption: s.caption,
          content: s.content,
        }));
        if (s.image) {
          formData.append(`section_image_${i}`, s.image);
        }
      });
      await createNews(formData)
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div className="max-w-7xl m-auto py-8">
      <h1 className="text-center mb-4 text-4xl font-semibold">Tạo mới bản tin</h1>
      <div className="fixed top-2 right-2">
        <Button type="primary" onClick={onSubmit}>Lưu bản tin</Button>
      </div>
      <div className="px-4">
        <div className="flex gap-4 mb-8">
          <div className="flex-1 flex flex-col">
            <div className={`flex ${isHotNews ? 'justify-between' : 'justify-end'} items-center mb-2`}>
              {isHotNews && <p className="px-2 py-0.5 bg-amber-500 rounded-xl">Tin nóng</p>}
              <div className="flex items-center gap-2 py-0.5">
                <p>Tin nóng:</p>
                <Switch title="Tin nóng" value={isHotNews} onChange={setIsHotNews} />
              </div>
            </div>
            <Input
              placeholder="Tiêu đề"
              name="title"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value)
              }}
            />
            <div className="flex items-center gap-1 text-gray-500 my-2">
              <ClockIcon width={16} height={16} fill="currentColor" />
              <p className="text-sm">{`${day < 10 ? `0${day}` : day}/${month < 10 ? `0${month}` : month}/${year}`}</p>
            </div>
            <div className="w-full">
              <p className="mb-2">Tổng quan</p>
              <Editor
                apiKey="hkoepxco9p2gme5kius6axtlk3n83yberu5a59m56l7dhgn3"
                value={summary}
                onEditorChange={(newContent) => setSummary(newContent)}
                init={{
                  height: 240,
                  menubar: false,
                  extended_valid_elements: "iframe[src|frameborder|style|scrolling|class|width|height|name|align]",
                  valid_elements: '*[*]',
                  plugins: [
                    'advlist autolink lists link image charmap print preview anchor',
                    'searchreplace visualblocks code fullscreen',
                    'insertdatetime media paste code help wordcount textcolor',
                    'table media paste',
                  ],
                  toolbar:
                    'undo redo | formatselect | bold italic backcolor | ' +
                    'alignleft aligncenter alignright alignjustify | ' +
                    'bullist numlist outdent indent | table | forecolor | removeformat | ' +
                    'image media',
                }}
              />
            </div>
          </div>
          <div className="flex-1">
            <div>
              <div className="flex justify-end mb-2">
                {!thumbnail && (
                  <label htmlFor="thumbnail">
                    <span className="px-4 py-2 rounded-lg bg-[#1677ff] hover:bg-[#4096ff] duration-300 text-white cursor-pointer">Thêm hình ảnh</span>
                  </label>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    setThumbnail(file);
                  }}
                  className="hidden"
                  id="thumbnail"
                />
                {thumbnail && (
                  <div
                    className="bg-red-500 rounded-full hover:bg-red-600 duration-300 cursor-pointer flex items-center justify-center"
                    onClick={() => {
                      setThumbnail(null);
                    }}
                  >
                    <MinusIcon title="Xóa hình ảnh" className="cursor-pointer" color='white' />
                  </div>
                )}
              </div>
              {thumbnail && <Image src={URL.createObjectURL(thumbnail)} alt="uploaded" className="m-auto" />}
            </div>
          </div>
        </div>

        {listSections.map((section, index) => (
          <NewsSection
            key={index + 1}
            orderIndex={index + 1}
            onRemoveSection={() => setListSections(prev => prev.filter((_, i) => i !== index))}
            dataSections={section}
            setListSections={setListSections}
          />
        ))}

        <div className="flex justify-center">
          <div
            className="w-10 h-10 bg-amber-500 rounded-md cursor-pointer flex items-center justify-center hover:opacity-80 duration-300 text-white"
            onClick={() => setListSections(prev => [...prev, { orderIndex: listSections.length + 1 }])}
          >
            <PlusIcon title="Thêm section" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreateNews