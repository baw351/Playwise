import React, { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './CreateTipForm.css';

function CreateTipForm() {
  const { id } = useParams(); 
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    videoUrl: '',
    category: 'general', 
    images: []
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const fileInputRef = useRef(null);
  
  const categories = [
    { value: 'general', label: 'Conseils généraux' },
    { value: 'walkthrough', label: 'Guide pas à pas' },
    { value: 'secret', label: 'Secrets et easter eggs' },
    { value: 'achievement', label: 'Trophées et succès' },
    { value: 'build', label: 'Build et équipement' },
    { value: 'strategy', label: 'Stratégies avancées' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    
    if (formData.images.length + files.length > 3) {
      setErrors({
        ...errors,
        images: 'Vous ne pouvez pas ajouter plus de 3 images'
      });
      return;
    }
    
    const newImages = files.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));
    
    setFormData({
      ...formData,
      images: [...formData.images, ...newImages]
    });
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveImage = (indexToRemove) => {
    const updatedImages = formData.images.filter((_, index) => index !== indexToRemove);
    
    URL.revokeObjectURL(formData.images[indexToRemove].preview);
    
    setFormData({
      ...formData,
      images: updatedImages
    });
    
    if (errors.images) {
      setErrors({
        ...errors,
        images: null
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Le titre est requis';
    } else if (formData.title.length < 5) {
      newErrors.title = 'Le titre doit contenir au moins 5 caractères';
    }
    
    if (!formData.content.trim()) {
      newErrors.content = 'Le contenu est requis';
    } else if (formData.content.length < 20) {
      newErrors.content = 'Veuillez fournir une description plus détaillée (minimum 20 caractères)';
    }
    
    if (formData.videoUrl) {
      const isYoutube = formData.videoUrl.includes('youtube.com') || formData.videoUrl.includes('youtu.be');
      const isTwitch = formData.videoUrl.includes('twitch.tv');
      
      if (!isYoutube && !isTwitch) {
        newErrors.videoUrl = 'Seules les URLs YouTube et Twitch sont acceptées';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      navigate(`/game/${id}/tips`);
    } catch (err) {
      console.error('Erreur lors de la création de l\'astuce:', err);
      setSubmitError('Une erreur est survenue lors de l\'enregistrement de votre astuce. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate(`/game/${id}/tips`);
  };

  return (
    <div className="create-tip-container">
      <h2>Partagez votre astuce</h2>
      
      {submitError && (
        <div className="error-message">
          {submitError}
        </div>
      )}
      
      <form className="tip-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Titre de l'astuce *</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Ex: Comment débloquer tous les personnages"
            maxLength={100}
          />
          {errors.title && <span className="error">{errors.title}</span>}
        </div>
        
        <div className="form-group">
          <label htmlFor="category">Catégorie</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
          >
            {categories.map(category => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="content">Votre astuce en détail *</label>
          <div className="text-editor">
            <div className="editor-toolbar">
              <button type="button" title="Gras">B</button>
              <button type="button" title="Italique">I</button>
              <button type="button" title="Liste à puces">•</button>
            </div>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              placeholder="Décrivez votre astuce en détail..."
              rows={8}
            ></textarea>
          </div>
          {errors.content && <span className="error">{errors.content}</span>}
          <div className="editor-help">
            Soyez précis et clair dans vos explications pour aider les autres joueurs
          </div>
        </div>
        
        <div className="form-group">
          <label>Images (optionnel)</label>
          <div className="image-upload-container">
            <label 
              htmlFor="image-upload" 
              className={`image-upload-button ${formData.images.length >= 3 ? 'disabled' : ''}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                <polyline points="21 15 16 10 5 21"></polyline>
              </svg>
              Ajouter des images
            </label>
            <input
              type="file"
              id="image-upload"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              ref={fileInputRef}
              disabled={formData.images.length >= 3}
            />
          </div>
          
          {errors.images && <span className="error">{errors.images}</span>}
          
          {formData.images.length > 0 && (
            <div className="image-previews">
              {formData.images.map((image, index) => (
                <div key={index} className="image-preview-item">
                  <img src={image.preview} alt={`Preview ${index}`} />
                  <button
                    type="button"
                    className="image-remove-button"
                    onClick={() => handleRemoveImage(index)}
                    aria-label="Supprimer l'image"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
          
          <div className="editor-help">
            Ajoutez jusqu'à 3 images pour illustrer votre astuce
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="videoUrl">Lien vidéo YouTube ou Twitch (optionnel)</label>
          <input
            type="url"
            id="videoUrl"
            name="videoUrl"
            value={formData.videoUrl}
            onChange={handleChange}
            placeholder="https://www.youtube.com/watch?v=..."
          />
          {errors.videoUrl && <span className="error">{errors.videoUrl}</span>}
          <div className="editor-help">
            Vous pouvez ajouter un lien vers une vidéo YouTube ou Twitch pour compléter votre astuce
          </div>
        </div>
        
        <div className="form-actions">
          <button 
            type="button" 
            className="btn-cancel" 
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            Annuler
          </button>
          <button 
            type="submit" 
            className="btn-submit" 
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <div className="spinner"></div>
                Envoi en cours...
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
                Publier l'astuce
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateTipForm;