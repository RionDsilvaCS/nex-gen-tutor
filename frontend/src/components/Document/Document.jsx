import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Upload, FileText } from 'lucide-react';
import './Document.css';

const DocUploadViewer = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadTime, setUploadTime] = useState(null);
  const [cards, setCards] = useState([]);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type.startsWith('image/')) {
      setFile(selectedFile);
      setError('');
    } else {
      setError('Please select a valid image file');
      setFile(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file first');
      return;
    }
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const response = await fetch('http://localhost:8005/upload-single-doc', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) {
        throw new Error('Upload failed');
      }
      const data = await response.json();
      setUploadTime(data.time);

      const mockData = [
        {
          "question": "What changes occur on heating copper powder and how are the products formed when hydrogen gas is passed over it? Provide the chemical equations for these reactions.",
          "answer": "Here's a breakdown of the changes that occur when you heat copper powder and introduce hydrogen gas, along with the corresponding chemical equations:\n\n*Heating Copper Powder:\n\n *Changes:*  Heating copper powder causes a series of physical and chemical changes. The powder will become hotter as energy is added. This increased temperature can lead to the following:\n    * *Expansion:*  The metal atoms move around more rapidly, causing an increase in volume (expansion). \n    * *Melting:* Copper's melting point is relatively low (~1085°C). As the powder heats up, it may begin to melt and solidify into a solid form.\n    * *Transformation:* The copper can undergo changes in its crystal structure at high temperatures.\n\n*Reaction with Hydrogen Gas:\n\n *The Process:* When hydrogen gas (H₂) is passed over heated copper powder, a chemical reaction takes place. This reaction involves the formation of *copper hydride (CuH), along with heat and potential evolution of water vapor. \n    * **Equation for Formation of Copper Hydride:*  2 Cu(s) + H₂(g) → CuH(s)\n\n*Explanation:* \n   * Copper has a relatively low reactivity at room temperature, but when heated to high temperatures, it begins to react with hydrogen gas. \n   * This reaction forms copper hydride (CuH), a compound that is less reactive than pure copper and exhibits different properties.  The heat generated during the reaction can result in changes to the copper powder's physical form.\n\n*Key Points:\n\n *Safety Precautions:* When working with hot metals or hydrogen gas, it's crucial to exercise extreme caution due to potential hazards such as fire, burns, and explosions.\n* *Controlled Environment:*  You should work under controlled environment for both heating processes and the introduction of hydrogen gas.\n\n\nLet me know if you have any other questions! \n"
        },
        {
          "question": "List the important products of the Chlor-alkali process.  Give one important use of each.",
          "answer": "Here are some important products of the chlor-alkali process, along with their key applications:\n\n*1. Chlorine (Cl2)* \n* *Use:* Water purification, disinfecting drinking water and swimming pools, bleaching pulp in paper production\n* *Further note:*  The vast majority of chlorine is produced for use in these applications. Other uses include making various chemicals, including solvents and pharmaceuticals.\n\n*2. Sodium Hydroxide (NaOH)\n *Use:*  Detergents, soap, paper production, water treatment, textile manufacturing\n* *Further note:* This compound plays a vital role in chemical processes and is often called \"caustic soda.\" \n\n*3. Sodium Chloride (NaCl)\n *Use:* Table salt, de-icing roads, food processing, industrial applications (chlorine source)\n* *Further note:*  Sodium chloride is essential for various human needs and has numerous industrial uses due to its properties and availability. \n\n\nLet me know if you'd like more details on any specific product or application! \n"
        },
        {
          "question": "A 5% solution of alkaline potassium permanganate is added to 3 mL of ethanol in a test tube. Describe the reaction that occurs and provide the chemical equation. Explain the role of the alkaline potassium permanganate in this reaction.",
          "answer": "Here's a breakdown of the reaction, its role of the reagent, and how it works:\n\n*Reaction:\n\nThe addition of alkaline potassium permanganate (KMnO₄) to ethanol will cause a **redox reaction, specifically an oxidation-reduction reaction.  Ethanol (C₂H₅OH) is oxidized by the permanganate ions in the solution to form acetaldehyde (CH₃CHO), carbon dioxide (CO₂), and water (H₂O).\n\nChemical Equation:\n\n2 C₂H₅OH + 2 KMnO₄ → 2 CH₃CHO + 2 KMnO₂ + 2 H₂O  \n\n *Explanation:* Potassium permanganate is a strong oxidizing agent. The Mn⁺⁴ in the KMnO₄ ion can readily accept electrons from ethanol, leading to the formation of acetaldehyde and manganese dioxide (MnO₂) as a by-product.  \n\n\n*Role of Alkaline Potassium Permanganate (KMnO₄):\n\n *Powerful Oxidizing Agent:* The alkaline environment created by the addition of potassium hydroxide (KOH) makes the permanganate ions (MnO₄⁻) even more potent oxidizing agents. \n* *Facilitates Oxidation:* In a basic solution, the KMnO₄ becomes more reactive and oxidizes ethanol faster, leading to a quicker reaction.\n\n\n*Why Is This Reaction Used in Tests?\n\nThe reaction of ethanol with alkaline potassium permanganate is commonly used in chemistry tests to:\n\n *Test for Ethanol (Alcohol):* The presence of ethanol will be indicated by the formation of acetaldehyde and the appearance of a color change from purple-brown to colorless. \n* *Detect the presence of an oxidizing agent:* This test serves as a quick way to identify the presence of strong oxidizing agents like potassium permanganate in a solution.\n\n\n*Important Notes:\n\n *Safety Precautions:*  Potassium permanganate is highly corrosive and can cause burns on contact with skin or eyes. It's essential to wear appropriate protective gear when working with this reagent.\n* *Concentration:* The concentration of the permanganate solution (5%) used in this test is suitable for observing the reaction clearly and quickly. Higher concentrations may lead to faster reactions but also pose greater risks of safety issues. \n\n\n\nLet me know if you have any more questions!"
        },
        {
          "question": "Explain how a squirrel reacts to a threatening situation in its body. What changes take place immediately in its body to help it fight or run away?",
          "answer": "Here's a look at a squirrel's immediate response to a threatening situation:\n\n*Squirrel's Fight-or-Flight Response:\n\n1. **Threat Perception:* A squirrel senses a threat – the approach of a large predator like a fox, a domestic dog, or even a human hand.\n2. *Sympathetic Nervous System Activation:* This rapid response is triggered by the sympathetic nervous system, which controls \"fight or flight\" reactions.  The body goes into overdrive!\n    * *Increased Heart Rate:* The heart rate skyrockets to pump blood faster for energy and movement. \n    * *Rapid Breathing:*  Airflow increases to bring more oxygen to muscles needing quick bursts of power.\n    * *Blood Flow Changes:* Blood flow is redirected away from non-essential organs like the digestive system and towards muscles, increasing muscle strength.\n3. *Muscular Activation & Body Preparation:* Muscles prepare for action:\n    * *Tensing Muscles:* The squirrel's body tenses up to make it more agile and ready for immediate movement. \n    * *Preparing for Running:*  The legs are stretched out to a high position, allowing the squirrel to leap or dash away quickly.\n    * *Tail-Boosting:*  Squirrel tails act as natural rudders and stabilizers during rapid movements.\n\n*Fighting or Fleeing?\n\n *Fight Mode:* If the threat is direct, like a predator's eyes locked on it, the squirrel might show a fierce display of its own defensive skills – sharp teeth and claws are used to deter attackers.\n* *Flight Mode:* Most often, squirrels rely on flight if they sense imminent danger. This may involve climbing trees quickly or dashing through bushes in an attempt to escape the threat.\n\n*Short-Term Physiological Changes:\n\n *Pupil Dilation:*  The squirrel's pupils will widen for greater visual acuity during fast movements.\n* *\"Fight, Flight, or Freeze\":* The squirrel experiences a primal response – either attack, run away, or freeze in fear until the threat passes. \n\n\n*Important Note:*  Squirrels are incredibly agile and adapt to their surroundings. A predator's presence often triggers these physiological changes even before the squirrel sees it. Their innate instincts drive them to action, helping them survive in their natural environment. \n"
        },
        {
          "question": "Why is chemical communication better than electrical impulses as a means of communication between cells in a multi-cellular organism? Explain the advantages and provide examples.",
          "answer": "While electrical impulses play a vital role in nerve cells, chemical communication (also known as signaling) is generally considered *superior* for intercellular communication in multicellular organisms for several reasons:\n\n*Advantages of Chemical Communication:\n\n *Specificity and Versatility:*  Chemical signals can be highly specific, targeting individual cells or groups of cells with precise receptors. This allows for intricate control of cellular activities. \n    * *Example:* Hormones like insulin act on target cells in the liver to regulate glucose levels, while neurotransmitters like acetylcholine directly affect muscle contraction.\n\n* *Distance and Efficiency:* Chemical signals can travel long distances through the body and have greater range than electrical impulses, allowing communication across large areas of tissue. This is particularly important for coordinating complex physiological processes.\n    * *Example:* The parasympathetic nervous system uses chemical messengers (acetylcholine) to regulate heart rate and digestion throughout the entire body.\n\n* *Modulation and Integration:* Chemical signals can be modulated by changing their concentration, receptor interaction, or duration of effect, allowing for dynamic responses to internal and external cues. \n    * *Example:* The release of adrenaline into the bloodstream allows quick adaptation during stressful situations like fight-or-flight response. The levels of this signal fluctuate based on the situation, leading to increased heart rate, blood pressure, and other physiological changes.\n\n* *Storage and Persistence:* Chemical signals can be stored or released over long periods, enabling continuous communication even after a single cell is exposed to a stimulus.\n    * *Example:* Hormones like testosterone are stored in Leydig cells and released according to demand, enabling sustained effects for growth and development.\n\n*Electrical Impulses - Advantages in Specific Situations:\n\nWhile chemical communication generally dominates the landscape of intercellular communication, electrical impulses have their own distinct advantages:\n\n *High Speed and Precision:* Electrical signals travel very quickly through neurons (up to 100 meters per second) with high precision. This is essential for rapid responses like reflexes and initiating muscle movements.\n    * *Example:* The signal for a reflex action in the leg, like kicking when something hits your foot, travels from sensory receptors to the brain and back within milliseconds.\n\n*In Conclusion:* \n\nThe choice between chemical communication and electrical impulses depends on the specific context of cellular communication. Chemical signaling excels in long-distance coordination, specificity, and modulation, while electrical impulses offer speed and precision for rapid responses.  Often, these two methods work together to ensure a complex and effective system for intercellular communication in multi-cellular organisms.\n\n\n"
        },
        {
          "question": "Define pollination. Differentiate between self-pollination and cross-pollination. What is the significance of pollination?",
          "answer": "## Pollination Defined\n\n*Pollination* is the biological process that involves the transfer of pollen, containing male genetic material (pollen grains), from the anther of a flower to the stigma of another flower of the same species. This crucial step leads to fertilization and ultimately, seed production in flowering plants (angiosperms). \n\n\n## Self-Pollination vs. Cross-Pollination\n\n*Self-pollination:\n Occurs when pollen is transferred from the anther of a flower to the stigma of the same flower or another flower on the same plant.\n* Requires no external agent like wind, water, or animals for pollen transfer.\n* Often leads to offspring with reduced genetic diversity due to limited gene mixing. \n\n*Cross-Pollination:\n Occurs when pollen is transferred from the anther of one flower to the stigma of a flower on a different plant of the same species. This process often involves external agents like wind, water, or animals (insects, birds, bats). \n* Increases genetic diversity in offspring due to mixing of genes from different plants.\n\n*Table for Comparison:\n\n| Feature | Self-pollination | Cross-pollination |\n|---|---|---|\n| Pollen transfer | Within the same flower/same plant | Between flowers of different plants of the same species |\n| External agent | No external agent required  | Requires wind, water, or animals |\n| Genetic diversity | Reduced | Increased |\n\n\n## Significance of Pollination\n\nEcological Importance:\n\n *Plant reproduction:* Crucial for producing fruits, seeds, and ultimately, new plant generations. Without pollination, many plants wouldn't be able to reproduce and would die out. \n* *Food production:* Nearly all food crops rely on pollination for their growth and successful production. Fruits, vegetables, grains, nuts - all are products of this vital process.\n* *Biodiversity support:*  Pollination services a key role in maintaining healthy ecosystems and supporting biodiversity.\n\n*Economic Importance:\n\n *Agriculture:*  A cornerstone for agriculture and food security worldwide. Pollinators contribute billions of dollars annually to the global economy through crop production. \n* *Industries:*  Honey, beekeeping, and other related industries rely on pollinators for their livelihood.\n\n\n*Overall, pollination is essential for life and plays a vital role in various aspects of our planet's ecosystem.*  Its importance cannot be overstated, and we must protect and promote this crucial process through sustainable practices like protecting pollinators and promoting biodiversity conservation. \n"
        },
        {
          "question": "What are homologous structures? Provide an example and answer if a homologous structure always shares a common ancestor.",
          "answer": "Here's a breakdown of homologous structures:\n\n*Definition:\n\nHomologous structures are anatomical features or traits that share the same underlying structural plan despite differences in function among different species. They provide evidence for shared ancestry and evolutionary relationships. \n\nExample:\n\n *Wings of Birds, Bats, and Insects:*  These seemingly diverse wings all have a similar basic design: bones, feathers (in birds), membranes (in bats), and chitinous plates (in insects). This common underlying structure despite different flight mechanisms is a classic example of homology.\n\n*Do Homologous Structures Always Share a Common Ancestor?* \n\nYes, *generally, homologous structures do indicate a shared common ancestor in evolution. However, it's important to note the following:\n\n *Evolutionary Adaptation:* Over time, species evolve and adapt to their environments. The structure might be modified for different functions while retaining some shared elements.\n* *Divergent Evolution:*  Similar-looking structures can arise independently due to convergent evolution, where unrelated organisms develop similar traits in response to similar environmental pressures.\n\n*Important Concepts to Remember:\n\n *Common Ancestry:* Homologous structures are strong evidence for the theory of common ancestry and provide clues about the evolutionary relationships between species.\n* *Shared Traits:*  These similarities suggest shared genetic heritage from a common ancestor, even if the specific functions have changed over time. \n\n\nLet me know if you'd like to explore more examples or dive deeper into any particular aspect of homologous structures! \n"
        },
        {
          "question": "Why is the Tyndall effect observed by colloidal particles? Give four instances where the Tyndall effect can be observed. ",
          "answer": "Here's a breakdown of why the Tyndall effect occurs and some real-world examples:\n\n*What is the Tyndall Effect?\n\nThe Tyndall effect describes the scattering of light by very small particles suspended in a medium (like water).  Think of it like tiny \"optical rain\" that makes things glow. This phenomenon is more pronounced when the particles are much larger than the wavelength of visible light. \n\n *Larger Particles = More Scattering:* The Tyndall effect arises from the interaction between light and these particles. When light hits a colloidal particle, some of the light gets scattered in all directions.  \n* *Specific Wavelengths Scattered:* We observe this scattering because the wavelengths of visible light (like red, yellow, green, blue) are different than each other, and some of them get scattered more easily than others. \n\n*Why does it happen with Colloidal Particles?\n\nColloidal particles have a size range between a few nanometers and several micrometers. This means they are big enough to scatter light (making the Tyndall effect visible) but not so large that they block the light completely (like a thick haze). \n\n\nFour Instances of the Tyndall Effect:\n\n1. **Rainbows:*  The beautiful arcs you see in a rainbow are created by sunlight scattering through water droplets. These droplets act like tiny colloidal particles, scattering all wavelengths of visible light in different directions, creating the colorful bands we see.\n2. *Milk (especially from cows):* The Tyndall effect can be seen when milk is illuminated or when it's being stirred.  The proteins and fat globules that make up milk act like colloidal particles, causing a scattered appearance, especially when the light shines through the milk. \n3. *Smoke:* Smoke particles are tiny enough to scatter visible light, which gives smoke its characteristic color and makes objects appear hazy. The more smoke you have, the stronger the Tyndall effect.\n4. *Water samples:* Even in clear water, adding a small amount of clay or sand (or even dust) will cause the Tyndall effect, especially in specific light conditions.\n\n\nLet me know if you'd like to explore any of these examples further! "
        },
        {
          "question": "Differentiate between a glass slab and a glass prism. What happens when a narrow beam of (i) monochromatic light and (ii) white light passes through (a) a glass slab and (b) a glass prism?",
          "answer": "Here's a breakdown of the differences between glass slabs and prisms, along with how they interact with different types of light:\n\n*Glass Slab vs. Glass Prism\n\n *Shape:* A *glass slab* is a flat piece of glass, while a *glass prism* has a triangular shape with specific angles.\n* *Light Refraction:* The angle at which light bends (refracts) changes based on the thickness and the material's refractive index. This effect depends on whether the light beam is incident upon a glass slab or travels through a glass prism. \n\n*How Light Passes Through Glass Slabs & Prisms\n\n(i) Monochromatic Light:\n    * **Glass Slab:*  A narrow beam of monochromatic light (single wavelength) will pass straight through a glass slab without any significant change in direction. This is due to the fact that the angle of refraction is not very large for the incident light, meaning it does not bend too much as the light travels.\n\n*Case: Monochromatic Light & Glass Slab\n   * **No Change:* The light beam goes straight through the slab without any significant change in direction or wavelength. \n\n\n*(ii) White Light:\n    * **Glass Slab:* When white light passes through a glass slab, it undergoes refraction. This means the different wavelengths of light (colors) within white light will bend at slightly different angles, leading to a spectrum of colors being dispersed. The degree of dispersion is dependent on how much the material is thick and the incident angle of the light beam. \n   * *Glass Prism:* When white light passes through a glass prism, it undergoes refraction and dispersion at an angle that depends on the wavelength of the light. This results in a rainbow-like effect where you see different colors separated from one another. The angle at which this occurs is dependent on the refractive index of the prism's material and the direction of incidence. \n\n*Case: White Light & Glass Slab\n   * **Dispersion:* The white light will separate into its different color components (e.g., red, orange, yellow, green, blue, indigo, violet) due to refraction and dispersion.\n\n\n *Key Points:\n\n *Refraction:* The bending of light as it passes from one medium to another (like from air to glass). \n* *Dispersion:* When different wavelengths of light bend at slightly different angles, leading to the separation of colors in a spectrum.\n\n\n*Let me know if you'd like a more detailed explanation on any specific aspect!*"
        },
        {
          "question": "How is the difference between a glass slab and a glass prism explained?  What changes happen in each case when passing through the material.",
          "answer": "Here's an explanation of how the difference between a glass slab and a glass prism impacts how light behaves:\n\n*Glass Slab:\n\n *Transparency:* A glass slab is completely transparent, allowing light to pass through it without much change. \n* *Refraction (Slight):*  Light will bend slightly as it passes from air into the glass. The amount of bending depends on the angle at which light hits the surface and how thick the slab is. This occurs due to a phenomenon called refraction. \n\n    * *How it works:* Light travels faster in air than in glass because the atoms in glass are less densely packed than those in air.  This difference in speed leads to a change in direction, causing light to bend towards the normal (an imaginary line perpendicular to the surface). The bending amount is governed by Snell's law, which relates the angles of incidence and refraction to the refractive indices of the two materials. \n\n* *No Color Separation:* A glass slab does not split light into different colors as it passes through it.\n\n\n*Glass Prism:\n\n *Transparency (Similar):* A glass prism is also transparent but has a specific shape - one that can be designed to create a spectrum of colors. \n* *Total Internal Reflection and Refraction:*  A key difference from a slab lies in the angle at which light hits the surface of a prism. When light enters a prism, it strikes the first surface at an angle different than what's expected for normal refraction. If this angle is greater than the critical angle, total internal reflection occurs where light reflects back into the prism instead of passing through it. This can create beautiful colors.  \n* *Dispersion:* The way colors are separated and how much each color separates depends on the refractive index and thickness of the glass prism used for analysis. \n\n    * *How it works:* Light travels at different speeds in air and within the prism. This is due to variations in the density of the materials that make up the prism.  As light passes through a prism, it's bent (refracted) and then reflected internally off the sides of the prism. This process creates the spectrum of colors we see. The color separation happens because each color has a different wavelength.\n\n* *Color Separation:* A glass prism can split white light into its constituent colors (the visible spectrum) due to total internal reflection and refraction.\n\n\n*In Summary:\n\n A glass slab allows light to pass through with minimal changes, primarily affecting the direction of travel via refraction.\n* A glass prism, with a specific shape that can be designed to create a spectrum of colors, is made for separating white light into its constituent colors (dispersion). \n\n\n\n\nLet me know if you'd like more details on any specific aspect or have additional questions!"
        }
      ];
      setCards(mockData);
    } catch (err) {
      setError('Failed to upload file: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="doc-viewer-container">
      <div className="doc-viewer-upload-section">
        <div className="doc-viewer-upload-area">
          <label className="doc-viewer-drop-zone">
            <Upload className="doc-viewer-upload-icon" />
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="doc-viewer-file-input"
            />
            <span className="doc-viewer-file-name">
              {file ? file.name : 'Click to upload an image'}
            </span>
          </label>
          <button
            onClick={handleUpload}
            disabled={!file || uploading}
            className="doc-viewer-upload-btn"
          >
            {uploading ? 'Uploading...' : 'Upload'}
          </button>
          {error && (
            <div className="doc-viewer-error">{error}</div>
          )}
          {uploadTime && (
            <div className="doc-viewer-upload-time">
              Upload time: {uploadTime.toFixed(3)}s
            </div>
          )}
        </div>
      </div>

      <div className="doc-viewer-cards-grid">
        {cards.map((card, index) => (
          <div key={index} className="doc-viewer-card">
            <div className="doc-viewer-card-header">
              <h3 className="doc-viewer-card-title">
                <FileText className="w-5 h-5" />
                Question {index + 1}
              </h3>
            </div>
            <div className="doc-viewer-card-body">
              <div className="doc-viewer-question">
                <ReactMarkdown>{card.question}</ReactMarkdown>
              </div>
              <div className="doc-viewer-answer-section">
                <h4 className="doc-viewer-answer-title">Answer:</h4>
                <ReactMarkdown className="doc-viewer-answer-text">{card.answer}</ReactMarkdown>
              </div>
            </div>
          </div>
        ))}
      </div>
      {uploading && (
        <div className="doc-viewer-spinner" />
      )}
    </div>
  );
};

export default DocUploadViewer;