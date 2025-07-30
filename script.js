// Handle image upload and preview
document.getElementById("imageUpload").addEventListener("change", function (e) {
    const file = e.target.files[0];
    const preview = document.getElementById("preview");

    if (file && file.type.match(/^image\//)) {
        const reader = new FileReader();
        reader.onload = function (e) {
            preview.src = e.target.result;
            preview.style.display = "block";
        };
        reader.readAsDataURL(file);
    } else {
        alert("Please select a valid image file (JPG, PNG, WebP, GIF, BMP).");
        preview.style.display = "none";
        preview.src = "";
    }
});

// Handle download as PDF
document.getElementById("downloadPDF").addEventListener("click", () => {
    const preview = document.getElementById("preview");

    if (!preview.src || preview.style.display === "none") {
        alert("Please upload an image first.");
        return;
    }

    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF();

    const img = new Image();
    img.src = preview.src;

    img.onload = function () {
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();

        // Calculate image dimensions while maintaining aspect ratio
        let imgWidth = pageWidth;
        let imgHeight = (img.height * imgWidth) / img.width;

        if (imgHeight > pageHeight) {
            imgHeight = pageHeight;
            imgWidth = (img.width * imgHeight) / img.height;
        }

        const format = img.src.startsWith("data:image/png") ? "PNG" : "JPEG";

        // Center the image on the page
        const x = (pageWidth - imgWidth) / 2;
        const y = (pageHeight - imgHeight) / 2;

        pdf.addImage(img, format, x, y, imgWidth, imgHeight);
        pdf.save("photo.pdf");
    };

    img.onerror = function () {
        alert("Failed to load image. Please try another file.");
    };
});
