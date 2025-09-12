import React, { useState } from 'react';
import { Upload, Camera, Send, AlertTriangle, Info, Clock, Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const MedicineAI: React.FC = () => {
  const { t } = useTranslation();
  const [selectedBot, setSelectedBot] = useState('quick');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [detectedMedicine, setDetectedMedicine] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [inputText, setInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const bots = [
    { id: 'quick', name: t('medicine.bots.quick'), icon: '⚡', description: t('medicine.bots.quickDesc') },
    { id: 'detailed', name: t('medicine.bots.detailed'), icon: '📋', description: t('medicine.bots.detailedDesc') },
    { id: 'pill-id', name: t('medicine.bots.pill'), icon: '💊', description: t('medicine.bots.pillDesc') },
  ];

  const sampleMedicineInfo = {
    name: 'Paracetamol 500mg',
    uses: [
      'Pain relief (headaches, muscle pain, dental pain)',
      'Fever reduction',
      'Cold and flu symptoms'
    ],
    dosage: {
      adult: '500-1000mg every 4-6 hours (max 4000mg/day)',
      pediatric: 'Based on weight: 10-15mg/kg every 4-6 hours'
    },
    sideEffects: [
      'Rare: Nausea, allergic reactions',
      'Overdose: Liver damage (serious concern)',
      'Skin rash (uncommon)'
    ],
    warnings: [
      'Do not exceed recommended dose',
      'Avoid alcohol consumption',
      'Consult doctor if pregnant/breastfeeding',
      'Check other medications for paracetamol content'
    ],
    safetyVerdict: 'Generally safe when used as directed. Widely used over-the-counter medication.'
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setUploadedImage(reader.result as string);
        setIsProcessing(true);
        
        // Simulate OCR processing
        setTimeout(() => {
          setDetectedMedicine('Paracetamol 500mg');
          setIsProcessing(false);
        }, 2000);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleConfirmDetection = () => {
    setShowResults(true);
    setUploadedImage(null);
  };

  const handleTextQuery = () => {
    if (!inputText.trim()) return;
    setDetectedMedicine(inputText);
    setShowResults(true);
    setInputText('');
  };

  const handleRetry = () => {
    setUploadedImage(null);
    setDetectedMedicine('');
    setShowResults(false);
    setIsProcessing(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-24 lg:pb-6">
      <div className="mb-8">
        <a href="/dashboard" className="inline-flex items-center text-primary hover:text-primary/80 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 mr-2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
          Back to Dashboard
        </a>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{t('medicine.title')}</h1>
        <p className="text-gray-600">{t('medicine.subtitle')}</p>
      </div>

      {!showResults && !uploadedImage && (
        <>
          {/* Bot Selection */}
          <div className="mb-8">
            <h2 className="font-semibold text-gray-900 mb-4">{t('medicine.chooseAssistant')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {bots.map((bot) => (
                <button
                  key={bot.id}
                  onClick={() => setSelectedBot(bot.id)}
                  className={`p-4 rounded-2xl border-2 transition-all ${
                    selectedBot === bot.id
                      ? 'border-teal-300 bg-teal-50'
                      : 'border-gray-200 bg-white/70 hover:border-gray-300'
                  }`}
                >
                  <div className="text-3xl mb-2">{bot.icon}</div>
                  <h3 className="font-semibold text-gray-900 mb-1">{bot.name}</h3>
                  <p className="text-sm text-gray-600">{bot.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Input Methods */}
          <div className="bg-white/70 backdrop-blur-lg rounded-3xl shadow-lg border border-white/50 overflow-hidden">
            <div className="p-8">
              <h3 className="font-semibold text-gray-900 mb-6">{t('medicine.subtitle')}</h3>
              
              {/* Text Input */}
              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 mb-3">{t('medicine.typeName')}</label>
                <div className="flex space-x-3">
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleTextQuery()}
                    placeholder={t('medicine.typePlaceholder')}
                    className="flex-1 p-4 border border-gray-200 rounded-2xl bg-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
                  />
                  <button
                    onClick={handleTextQuery}
                    disabled={!inputText.trim()}
                    className="px-6 py-4 bg-teal-600 text-white rounded-2xl hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    <Send size={20} />
                  </button>
                </div>
              </div>

              {/* Divider */}
              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">{t('medicine.or')}</span>
                </div>
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">{t('medicine.uploadLabel')}</label>
                <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:border-gray-400 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label htmlFor="image-upload" className="cursor-pointer">
                    <div className="flex flex-col items-center space-y-4">
                      <div className="flex space-x-4">
                        <Upload size={40} className="text-gray-400" />
                        <Camera size={40} className="text-gray-400" />
                      </div>
                      <div>
                        <p className="text-lg font-medium text-gray-900 mb-1">{t('medicine.uploadCtaTitle')}</p>
                        <p className="text-sm text-gray-600">{t('medicine.uploadCtaSub')}</p>
                      </div>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Image Processing */}
      {uploadedImage && (
        <div className="bg-white/70 backdrop-blur-lg rounded-3xl shadow-lg border border-white/50 overflow-hidden">
          <div className="p-8">
            <h3 className="font-semibold text-gray-900 mb-6">Image Processing</h3>
            
            <div className="flex flex-col lg:flex-row space-y-6 lg:space-y-0 lg:space-x-8">
              <div className="lg:w-1/2">
                <img 
                  src={uploadedImage} 
                  alt="Uploaded medicine"
                  className="w-full h-64 object-cover rounded-2xl"
                />
              </div>
              
              <div className="lg:w-1/2">
                {isProcessing ? (
                  <div className="flex flex-col items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mb-4"></div>
                    <p className="text-gray-600">{t('medicine.processing')}</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="bg-teal-50 border border-teal-200 rounded-2xl p-4">
                      <h4 className="font-medium text-teal-900 mb-2">{t('medicine.detected')}</h4>
                      <p className="text-lg font-bold text-teal-800">{detectedMedicine}</p>
                    </div>
                    
                    <p className="text-gray-600">Is this detection correct?</p>
                    
                    <div className="flex space-x-3">
                      <button
                        onClick={handleConfirmDetection}
                        className="flex-1 bg-teal-600 text-white py-3 rounded-xl hover:bg-teal-700 transition-colors font-medium"
                      >
                        {t('medicine.confirm')}
                      </button>
                      <button
                        onClick={handleRetry}
                        className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-xl hover:bg-gray-300 transition-colors font-medium"
                      >
                        {t('medicine.retry')}
                      </button>
                    </div>
                    
                    <div className="mt-4">
                      <input
                        type="text"
                        value={detectedMedicine}
                        onChange={(e) => setDetectedMedicine(e.target.value)}
                        placeholder={t('medicine.correctPlaceholder')}
                        className="w-full p-3 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      {showResults && (
        <div className="bg-white/70 backdrop-blur-lg rounded-3xl shadow-lg border border-white/50 overflow-hidden">
          <div className="p-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="text-3xl">💊</div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">{sampleMedicineInfo.name}</h3>
                <p className="text-gray-600">{t('medicine.info')}</p>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                {/* What it's used for */}
                <div className="bg-blue-50 rounded-2xl p-6">
                  <h4 className="flex items-center space-x-2 font-semibold text-blue-900 mb-3">
                    <Info size={20} />
                    <span>{t('medicine.usedFor')}</span>
                  </h4>
                  <ul className="space-y-2">
                    {sampleMedicineInfo.uses.map((use, index) => (
                      <li key={index} className="flex items-start space-x-2 text-blue-800">
                        <span className="text-blue-600 mt-1">•</span>
                        <span>{use}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Dosage */}
                <div className="bg-green-50 rounded-2xl p-6">
                  <h4 className="flex items-center space-x-2 font-semibold text-green-900 mb-3">
                    <Clock size={20} />
                    <span>{t('medicine.dosage')}</span>
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <p className="font-medium text-green-800">{t('medicine.adults')}</p>
                      <p className="text-green-700">{sampleMedicineInfo.dosage.adult}</p>
                    </div>
                    <div>
                      <p className="font-medium text-green-800">{t('medicine.children')}</p>
                      <p className="text-green-700">{sampleMedicineInfo.dosage.pediatric}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                {/* Side Effects */}
                <div className="bg-yellow-50 rounded-2xl p-6">
                  <h4 className="flex items-center space-x-2 font-semibold text-yellow-900 mb-3">
                    <AlertTriangle size={20} />
                    <span>{t('medicine.sideEffects')}</span>
                  </h4>
                  <ul className="space-y-2">
                    {sampleMedicineInfo.sideEffects.map((effect, index) => (
                      <li key={index} className="flex items-start space-x-2 text-yellow-800">
                        <span className="text-yellow-600 mt-1">•</span>
                        <span>{effect}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Warnings */}
                <div className="bg-red-50 rounded-2xl p-6">
                  <h4 className="flex items-center space-x-2 font-semibold text-red-900 mb-3">
                    <AlertTriangle size={20} />
                    <span>{t('medicine.warnings')}</span>
                  </h4>
                  <ul className="space-y-2">
                    {sampleMedicineInfo.warnings.map((warning, index) => (
                      <li key={index} className="flex items-start space-x-2 text-red-800">
                        <span className="text-red-600 mt-1">•</span>
                        <span>{warning}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Safety Verdict */}
            <div className="mt-8 bg-teal-50 border-2 border-teal-200 rounded-2xl p-6">
              <h4 className="font-semibold text-teal-900 mb-2">{t('medicine.isItSafe')}</h4>
              <p className="text-teal-800 mb-4">{sampleMedicineInfo.safetyVerdict}</p>
              <p className="text-sm text-teal-700 font-medium">{t('medicine.followDoctor')}</p>
            </div>

            {/* Disclaimer */}
            <div className="mt-6 bg-gray-100 rounded-2xl p-6">
              <h4 className="font-semibold text-gray-900 mb-2 flex items-center space-x-2">
                <AlertTriangle size={20} className="text-orange-500" />
                <span>{t('medicine.disclaimerTitle')}</span>
              </h4>
              <p className="text-gray-800 text-sm leading-relaxed">{t('medicine.disclaimer')}</p>
            </div>

            {/* Actions */}
            <div className="mt-8 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
              <button
                onClick={handleRetry}
                className="flex-1 bg-teal-600 text-white py-3 rounded-xl hover:bg-teal-700 transition-colors font-medium"
              >
                {t('medicine.searchAnother')}
              </button>
              <button className="flex-1 bg-orange-500 text-white py-3 rounded-xl hover:bg-orange-600 transition-colors font-medium">
                {t('medicine.contactPharmacist')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Disclaimer at bottom */}
      {!showResults && (
        <div className="mt-8 bg-orange-50 border border-orange-200 rounded-2xl p-4">
          <div className="flex items-start space-x-3">
            <AlertTriangle size={20} className="text-orange-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-orange-800">{t('medicine.medicalDisclaimer')}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicineAI;