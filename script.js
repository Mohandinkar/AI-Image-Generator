const generateForm = document.querySelector(".generate-form");
const imageGallery = document.querySelector(".image-gallery");

const OPENAI_API_KEY = "USE YOUR OWN API KEY";
const updateImageCard = (imgDataArray)=>{
    imgDataArray.forEach((imgObject,index)=>{
        const imgCard = imageGallery.querySelectorAll(".img-card")[index];
        const imgElement = imgCard.querySelector("img");
        const downloadBtn = imgCard.querySelector(".download-btn");

        //set the image source to the AI-generated image data
        const aiGeneratedImg = `data:image/jpeg;base64,${imgObject.b64_json}`;
        imgElement.src = aiGeneratedImg;

        //when img loaded remove the loading class & set download attributes
        imgElement.onload = () =>{
            imgCard.classList.remove("loading");
            downloadBtn.setAttribute("href",aiGeneratedImg);
            downloadBtn.setAttribute("download",`${new Date().getTime()}.jpg`);
        }
    });
}

const handleFormSubmission = (e) => {
    e.preventDefault();

    const userPrompt =e.srcElement[0].value;
    const userImgQuantity = e.srcElement[1].value;

    const generateAiImages = async(userPrompt, userImgQuantity)=>{
        try{
            //send a request to the api to generate images based on user inputs
            const response = await fetch("https://api.openai.com/v1/images/generations",{
                method : "POST",
                headers : {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${OPENAI_API_KEY}`
                },
                body: JSON.stringify({
                    prompt: userPrompt,
                    n : parseInt(userImgQuantity),
                    size :"512x512",
                    response_format :"b64_json"
                })

            });

            if(!response.ok) throw new Error("Failed to generate images! Please try again.");

            const { data } = await response.json();//get data from the response
            updateImageCard([...data]);
        }catch(error){
            alert(error.message);
        }
    }

    // console.log(userPrompt,userImgQuantity);
    const imgCardMarkup = Array.from({length: userImgQuantity},() => 
        `<div class="img-card loading">
        <img src="images/loader.svg" alt="image" />
        <a href="#" class="download-btn">
            <img src="images/download.svg" alt="download icon" />
        </a>
    </div>`
        
    ).join("");
    // console.log(imgCardMarkup);
    imageGallery.innerHTML = imgCardMarkup;
    generateAiImages(userPrompt,userImgQuantity);
}
generateForm.addEventListener("submit",handleFormSubmission);

//PRELOADER 
let preloader = document.getElementById("loading-btn");
function myFunction(){
    preloader.style.display = "none";
}

