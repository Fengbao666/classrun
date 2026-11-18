# ClassRun 第三方组件与许可说明

本项目包含/使用了以下第三方组件，发布时请保留本文件与各组件自带的 LICENSE：

| 组件 | 用途 | 许可 |
| --- | --- | --- |
| Tesseract.js / Tesseract OCR | 浏览器端离线 OCR 兜底 | Apache-2.0 |
| tessdata `chi_sim` 中文模型 | Tesseract 中文识别 | Apache-2.0（tessdata） |
| RapidOCR (rapidocr-onnxruntime) | 本地服务端 PP-OCR 推理 | Apache-2.0 |
| PaddleOCR PP-OCRv4 检测/识别模型 | 本地服务端 OCR | Apache-2.0（PaddlePaddle/PaddleOCR） |
| ONNX Runtime | 浏览器/服务端模型推理 | MIT |
| OpenCV / NumPy / Pillow / Shapely 等 Python 依赖 | 图像处理 | 各自 BSD/Apache/HPND 等，见 `ocr/py/*.dist-info` 内的许可证 |
| cloudflared | 公网临时隧道（可选） | Apache-2.0 |
| 嵌入式 Python 3.12 | 便携版运行时（可选） | PSF License |

说明：
- 本仓库的 `ocr/py/` 与 `python/` 是从 wheel/官方发行版解包的可选运行时；升级时请同步更新版本与许可证文件。
- `bin/cloudflared.exe` 为可选工具；公网访问关闭后不参与运行。
- 字体使用系统字体（微软雅黑/PingFang 等），未嵌入第三方字体文件。
