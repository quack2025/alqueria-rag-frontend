// SavitalUserEditor.tsx - Editor de Usuarios Sintéticos
import React, { useState, useEffect } from 'react';
import { 
  User, 
  Edit2, 
  Save, 
  X, 
  Plus, 
  Trash2, 
  MapPin, 
  Briefcase, 
  Heart, 
  DollarSign,
  Scissors,
  Star,
  ArrowLeft
} from 'lucide-react';
import { SAVITAL_FOCUS_GROUP, type SavitalFocusUser } from '../../data/savitalFocusGroup';

interface SavitalUserEditorProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (users: SavitalFocusUser[]) => void;
}

const SavitalUserEditor: React.FC<SavitalUserEditorProps> = ({ 
  isOpen, 
  onClose, 
  onSave 
}) => {
  const [users, setUsers] = useState<SavitalFocusUser[]>(SAVITAL_FOCUS_GROUP);
  const [selectedUser, setSelectedUser] = useState<SavitalFocusUser | null>(null);
  const [editingUser, setEditingUser] = useState<SavitalFocusUser | null>(null);
  const [showAddNew, setShowAddNew] = useState(false);

  useEffect(() => {
    setUsers([...SAVITAL_FOCUS_GROUP]);
  }, []);

  const handleEditUser = (user: SavitalFocusUser) => {
    setEditingUser({ ...user });
    setSelectedUser(user);
  };

  const handleSaveUser = () => {
    if (!editingUser) return;
    
    const updatedUsers = users.map(user => 
      user.id === editingUser.id ? editingUser : user
    );
    
    setUsers(updatedUsers);
    setEditingUser(null);
    setSelectedUser(null);
    
    if (onSave) {
      onSave(updatedUsers);
    }
  };

  const handleInputChange = (field: string, value: any, section?: string) => {
    if (!editingUser) return;
    
    setEditingUser(prev => {
      if (!prev) return prev;
      
      if (section) {
        return {
          ...prev,
          [section]: {
            ...prev[section as keyof SavitalFocusUser],
            [field]: value
          }
        };
      }
      
      return {
        ...prev,
        [field]: value
      };
    });
  };

  const handleArrayChange = (field: string, index: number, value: string, section?: string) => {
    if (!editingUser) return;
    
    setEditingUser(prev => {
      if (!prev) return prev;
      
      const targetObj = section ? prev[section as keyof SavitalFocusUser] : prev;
      const currentArray = [...(targetObj[field as keyof typeof targetObj] as string[])];
      currentArray[index] = value;
      
      if (section) {
        return {
          ...prev,
          [section]: {
            ...prev[section as keyof SavitalFocusUser],
            [field]: currentArray
          }
        };
      }
      
      return {
        ...prev,
        [field]: currentArray
      };
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-6xl max-h-[95vh] overflow-hidden m-4">
        
        {/* Header */}
        <div className="p-6 border-b flex items-center justify-between bg-gray-50">
          <div className="flex items-center space-x-3">
            {selectedUser && (
              <button
                onClick={() => setSelectedUser(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <User className="w-6 h-6 text-blue-600" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {selectedUser ? `Editar: ${selectedUser.name}` : 'Editor de Usuarios Sintéticos'}
              </h3>
              <p className="text-sm text-gray-600">
                {selectedUser ? 'Modifica los aspectos de la usuaria' : `Gestiona ${users.length} usuarias sintéticas`}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex h-[calc(95vh-80px)]">
          {/* Sidebar - Lista de usuarios */}
          {!selectedUser && (
            <div className="w-1/3 border-r bg-gray-50 p-4 overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium text-gray-900">Usuarias ({users.length})</h4>
                <button
                  onClick={() => setShowAddNew(true)}
                  className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 text-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Nueva</span>
                </button>
              </div>
              
              <div className="space-y-2">
                {users.map(user => (
                  <div
                    key={user.id}
                    className="bg-white p-4 rounded-lg border hover:border-blue-300 cursor-pointer transition-colors"
                    onClick={() => handleEditUser(user)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-medium text-gray-900">{user.name}</h5>
                      <Edit2 className="w-4 h-4 text-gray-400" />
                    </div>
                    
                    <div className="space-y-1 text-xs text-gray-600">
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-3 h-3" />
                        <span>{user.city} - {user.age} años</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Briefcase className="w-3 h-3" />
                        <span>{user.occupation}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <DollarSign className="w-3 h-3" />
                        <span>NSE {user.nse}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Heart className="w-3 h-3" />
                        <span className={user.savital_relationship.is_user ? 'text-green-600' : 'text-gray-500'}>
                          {user.savital_relationship.is_user ? 'Usuaria Savital' : 'No usuaria'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Editor Principal */}
          {selectedUser && editingUser && (
            <div className="flex-1 p-6 overflow-y-auto">
              <div className="max-w-4xl mx-auto">
                
                {/* Información Básica */}
                <div className="bg-white border rounded-xl p-6 mb-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <User className="w-5 h-5 text-blue-600 mr-2" />
                    Información Básica
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Nombre</label>
                      <input
                        type="text"
                        value={editingUser.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Edad</label>
                      <input
                        type="number"
                        value={editingUser.age}
                        onChange={(e) => handleInputChange('age', parseInt(e.target.value))}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Ciudad</label>
                      <select
                        value={editingUser.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="Bogotá">Bogotá</option>
                        <option value="Barranquilla">Barranquilla</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">NSE</label>
                      <select
                        value={editingUser.nse}
                        onChange={(e) => handleInputChange('nse', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="C+">C+</option>
                        <option value="C">C</option>
                      </select>
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Ocupación</label>
                      <input
                        type="text"
                        value={editingUser.occupation}
                        onChange={(e) => handleInputChange('occupation', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Composición Familiar</label>
                      <input
                        type="text"
                        value={editingUser.family_composition}
                        onChange={(e) => handleInputChange('family_composition', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Ingresos Mensuales (COP)</label>
                      <input
                        type="number"
                        value={editingUser.monthly_income}
                        onChange={(e) => handleInputChange('monthly_income', parseInt(e.target.value))}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Perfil Capilar */}
                <div className="bg-white border rounded-xl p-6 mb-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Scissors className="w-5 h-5 text-purple-600 mr-2" />
                    Perfil Capilar
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Cabello</label>
                      <input
                        type="text"
                        value={editingUser.hair_profile.hair_type}
                        onChange={(e) => handleInputChange('hair_type', e.target.value, 'hair_profile')}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Frecuencia de Lavado</label>
                      <input
                        type="text"
                        value={editingUser.hair_profile.washing_frequency}
                        onChange={(e) => handleInputChange('washing_frequency', e.target.value, 'hair_profile')}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Rutina de Peinado</label>
                      <input
                        type="text"
                        value={editingUser.hair_profile.styling_routine}
                        onChange={(e) => handleInputChange('styling_routine', e.target.value, 'hair_profile')}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Nivel de Daño</label>
                      <select
                        value={editingUser.hair_profile.hair_damage_level}
                        onChange={(e) => handleInputChange('hair_damage_level', e.target.value, 'hair_profile')}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="bajo">Bajo</option>
                        <option value="medio">Medio</option>
                        <option value="alto">Alto</option>
                      </select>
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Principales Preocupaciones</label>
                      {editingUser.hair_profile.main_concerns.map((concern, index) => (
                        <div key={index} className="flex items-center space-x-2 mb-2">
                          <input
                            type="text"
                            value={concern}
                            onChange={(e) => handleArrayChange('main_concerns', index, e.target.value, 'hair_profile')}
                            className="flex-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Relación con Savital */}
                <div className="bg-white border rounded-xl p-6 mb-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Heart className="w-5 h-5 text-red-600 mr-2" />
                    Relación con Savital
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Es Usuaria</label>
                      <select
                        value={editingUser.savital_relationship.is_user ? 'true' : 'false'}
                        onChange={(e) => handleInputChange('is_user', e.target.value === 'true', 'savital_relationship')}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="true">Sí</option>
                        <option value="false">No</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Awareness (%)</label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={editingUser.savital_relationship.awareness}
                        onChange={(e) => handleInputChange('awareness', parseInt(e.target.value), 'savital_relationship')}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Status de Prueba</label>
                      <select
                        value={editingUser.savital_relationship.trial_status}
                        onChange={(e) => handleInputChange('trial_status', e.target.value, 'savital_relationship')}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="never-tried">Never Tried</option>
                        <option value="tried-once">Tried Once</option>
                        <option value="regular-user">Regular User</option>
                        <option value="loyal-user">Loyal User</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Frecuencia de Uso</label>
                      <input
                        type="text"
                        value={editingUser.savital_relationship.usage_frequency}
                        onChange={(e) => handleInputChange('usage_frequency', e.target.value, 'savital_relationship')}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Satisfacción (1-10)</label>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={editingUser.savital_relationship.satisfaction_score}
                        onChange={(e) => handleInputChange('satisfaction_score', parseInt(e.target.value), 'savital_relationship')}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Intención de Recompra (%)</label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={editingUser.savital_relationship.repurchase_intention}
                        onChange={(e) => handleInputChange('repurchase_intention', parseInt(e.target.value), 'savital_relationship')}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Botones de Acción */}
                <div className="flex items-center justify-end space-x-4 bg-gray-50 p-4 rounded-lg">
                  <button
                    onClick={() => {
                      setEditingUser(null);
                      setSelectedUser(null);
                    }}
                    className="flex items-center space-x-2 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    <X className="w-4 h-4" />
                    <span>Cancelar</span>
                  </button>
                  
                  <button
                    onClick={handleSaveUser}
                    className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    <span>Guardar Cambios</span>
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default SavitalUserEditor;