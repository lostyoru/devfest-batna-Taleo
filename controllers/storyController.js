const User = require("../models/User");
const Story = require("../models/Story");
const OpenAI = require("openai");
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const Replicate = require("replicate");
const cloudinary = require('../utils/cloudinary');
const fs = require('fs')
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});


async function getStories(req, res) {
  try {
    const stories = await Story.find();
    return res.status(200).json(stories);
  } catch (error) {
    return res.status(500).json({ message: 'Something went wrong' });
  }
}

async function getStoryById(req, res) {
  try {
    const story = await Story.findById(req.params.id);
    if(!story){
      return res.status(404).json({ message: 'Story not found' });
    }
    return res.status(200).json({ story });
  } catch(err) {
    return res.status(500).json({success: false, err: err.message})
  }
}

async function getStoryByUser(req, res) {
  try {
    const user = await User.findOne({ username: req.user });
    const stories = await Story.find({ user });
    return res.status(200).json(stories);
  } catch (error) {
    return res.status(500).json({ message: 'Something went wrong' });
  }
}

async function getImageStoriesByUser(req, res) {
  try {
    const user = await User.findOne({ username: req.user });
    const stories = await Story.find({ user, image: { $exists: true } }); 
    return res.status(200).json(stories);
  } catch (error) {
    return res.status(500).json({ message: 'Something went wrong' });
  }
}

async function getTextStoriesByUser(req, res) {
  try {
    const user = await User.findOne({ username: req.user });
    const stories = await Story.find({ user, image: { $exists: false } }); 
    return res.status(200).json(stories);
  } catch (error) {
    return res.status(500).json({ message: 'Something went wrong' });
  }
}

async function generateStory(req, res) {
  try {
    const { keywords } = req.body;
    console.log("the image from the req to generate a story : ", req.body.image);
    const imageGen = req.body.image;
    let image = undefined;
    if(imageGen) {
      image = imageGen
    }
    console.log(keywords);
    const user = await User.findOne({ username: req.user });
    const introduction = `
    Generate a story about the impact of war, turmoil, and resilience in a conflicted region. 
    Explore the struggles, emotions, and experiences of individuals affected by conflict and hardship. 
    Highlight the resilience and hardships faced by the community amidst the turmoil. 
    Discuss the significance and symbolism of the local symbols or flags in the context of ongoing conflicts. 
    Craft a narrative that sheds light on the human aspect of the struggle for peace and sovereignty.
  `;

  const prompt = `${introduction}\n\nGenerate a story about ${keywords} in 40 lines and start with newline after its title`;
    const completion = await openai.chat.completions.create({
      messages: [
        {"role": "user", "content": prompt}
      ],
      model: "gpt-4",
    });

    console.log(completion.choices[0].message['content']);
    const title = completion.choices[0].message['content'].split('\n')[0].replace("Title: ", "").replace('"','').trim();
    console.log("title: ", title)
    const body = completion.choices[0].message['content'].split('\n').slice(1).join('\n').trim();
    console.log("body: ", body)

    const story = await Story.create({
      title,
      body,
      user,
      image
    });
    console.log(user);
    return res.status(200).json({success: true, story})
  } catch (error) {
    console.error('Error:', error.message);
    return res.status(500).json({success: false, message: error.message});
  }
}

async function imageToStory(req, res) {
  try {
    const { keywords } = req.body;
    const imageGen = req.body.image;
    const path = req.file?.path;
    const user = await User.findOne({ username: req.user });
    console.log("typeof keywords : ", typeof keywords);
    console.log(req.body.image);
    let image;
    if(path){
        let result = await cloudinary.uploader.upload(path, {
            resource_type: "image",
        });
        await fs.unlink(path, (err) => {
            if (err) {
                console.error(err)
                return
                }
            })
        image = result.secure_url;
    }
    if(!image){
      image = imageGen
    }
    const output = await replicate.run(
      "andreasjansson/blip-2:f677695e5e89f8b236e52ecd1d3f01beb44c34606419bcc19345e046d8f786f9",
      {
        input: {
          image: image,
        }
      }
    );
    console.log("image description: ",output); 
    console.log("the story: ");
    console.log('hhhhh')
    if(!keywords){ 
      req.body = { 
        keywords: output,
        image
      };
    }else{
      req.body = { 
        keywords: `${keywords}, ${output}`,
        image
      };
    }
    console.log("the imageeeeeee : ", image);
    req.body.image = image;
    await generateStory(req, res);
    return res.status(200);
  } catch (error) {
    console.error('Error:', error.message);
    return res.status(500).json({success: false, message: error.message});
  }
}





async function generateImageStory(req, res) {
  try {
    const { keywords } = req.body;
    console.log(keywords);
    const introduction = `
    The canvas of human suffering. 
    ${keywords} have cast a relentless shadow over the lands, leaving a tapestry of stories that evoke profound emotions.
    What aspects of this struggle would you like to explore further? Your input will shape the narrative and bring light to the human experience amidst adversity.
  `;  
  
  const prompt = `
    ${introduction}\n\n Share a narrative that vividly illustrates in realistic image the impact of ${keywords} on the lives of individuals in Palestine.
    Embrace the resilience, struggles, and aspirations of those navigating through these challenges. 
    How does ${keywords} influence the quest for peace and sovereignty in the region? Let your imagination guide this tale and keep it realistic.
  `;
    const image = await openai.images.generate({ 
        model: "dall-e-3", 
        prompt
    });
    console.log(image.data[0].url);
    req.body.image = `${image.data[0].url}`;
    console.log('image from generating : ', req.body.image)
    req.body.keywords = keywords;
    imageToStory(req, res);
    return res.status(200);
  } catch (error) {
    console.error('Error:', error.message);
    return res.status(500).json({success: false, message: error.message});
  }
}

module.exports = {
  getStories,
  getStoryByUser,
  getImageStoriesByUser,
  getTextStoriesByUser,
  getStoryById,
  generateStory,
  imageToStory,
  generateImageStory
}

