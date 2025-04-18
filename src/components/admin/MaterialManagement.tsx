'use client';

import React, { useState, useEffect, useCallback } from 'react';

// --- Interfaces (can be shared or redefined) ---
interface Tag {
  ID: number;
  Name: string;
  CreatedAt: string;
  UpdatedAt: string;
}

interface Material {
    ID: number;
    URL: string;
    MetaTags: string; // Serialized meta tags
    Description: string;
    CreatedAt: string;
    UpdatedAt: string;
    Tags: Tag[]; // Association
}

// --- Prop Types ---
interface MaterialManagementProps {
  BACKEND_URL: string | undefined;
  tags: Tag[]; // Pass all tags from parent
  getAuthHeaders: (includeContentType?: boolean) => Record<string, string> | null;
  parseError: (response: Response) => Promise<string>;
  // Styling props
  baseButtonClass: string;
  primaryButtonClass: string;
  secondaryButtonClass: string;
  dangerButtonClass: string;
  inputClass: string;
  ErrorMessage: React.FC<{ children: React.ReactNode }>;
  LoadingIndicator: React.FC<{ children: React.ReactNode }>;
  EmptyTableMessage: React.FC<{ colSpan: number; children: React.ReactNode }>;
}

// --- Component ---
const MaterialManagement: React.FC<MaterialManagementProps> = ({
  BACKEND_URL,
  tags,
  getAuthHeaders,
  parseError,
  baseButtonClass,
  primaryButtonClass,
  secondaryButtonClass,
  dangerButtonClass,
  inputClass,
  ErrorMessage,
  LoadingIndicator,
  EmptyTableMessage,
}) => {
  // --- State for Materials ---
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loadingMaterials, setLoadingMaterials] = useState<boolean>(false);
  const [materialError, setMaterialError] = useState<string | null>(null);
  const [isMaterialModalOpen, setIsMaterialModalOpen] = useState<boolean>(false);
  const [currentMaterial, setCurrentMaterial] = useState<Partial<Material> | null>(null);
  // Form state for material modal
  const [materialURL, setMaterialURL] = useState<string>('');
  const [materialDescription, setMaterialDescription] = useState<string>('');
  const [materialMetaTags, setMaterialMetaTags] = useState<string>('');

  // --- State for Material Tags Modal ---
  const [isMaterialTagsModalOpen, setIsMaterialTagsModalOpen] = useState<boolean>(false);
  const [materialForTags, setMaterialForTags] = useState<Material | null>(null);
  const [tagsForCurrentMaterialInModal, setTagsForCurrentMaterialInModal] = useState<Tag[]>([]);
  const [availableTagsForModal, setAvailableTagsForModal] = useState<Tag[]>([]);
  const [loadingMaterialTagsModal, setLoadingMaterialTagsModal] = useState<boolean>(false);
  const [materialTagsModalError, setMaterialTagsModalError] = useState<string | null>(null);

  // --- Material CRUD Functions ---
  const fetchMaterials = useCallback(async () => {
    if (!BACKEND_URL) return;
    const headers = getAuthHeaders(false);
    if (!headers) {
      setMaterialError("Authentication required to fetch materials.");
      return;
    }
    setLoadingMaterials(true);
    setMaterialError(null);
    try {
      const url = `${BACKEND_URL}/v1/api/materials`;
      const response = await fetch(url, { method: 'GET', headers, cache: 'no-store' });
      if (!response.ok) throw new Error(await parseError(response));
      const data = await response.json();
      setMaterials(data || []);
    } catch (e) {
      setMaterialError(e instanceof Error ? e.message : 'Error fetching materials');
      setMaterials([]);
    } finally {
      setLoadingMaterials(false);
    }
  }, [BACKEND_URL, getAuthHeaders, parseError]);

  // Initial fetch
  useEffect(() => {
    fetchMaterials();
  }, [fetchMaterials]);

  // --- Handlers for Material Modal ---
  const handleOpenMaterialModal = (material: Partial<Material> | null = null) => {
    setCurrentMaterial(material);
    setMaterialURL(material?.URL || '');
    setMaterialDescription(material?.Description || '');
    setMaterialMetaTags(material?.MetaTags || '');
    setIsMaterialModalOpen(true);
    setMaterialError(null);
  };

  const handleCloseMaterialModal = () => {
    setIsMaterialModalOpen(false);
    setCurrentMaterial(null);
    setMaterialURL('');
    setMaterialDescription('');
    setMaterialMetaTags('');
    setMaterialError(null);
  };

  const handleSaveMaterial = useCallback(async () => {
    if (!materialURL.trim() || !materialDescription.trim() || !BACKEND_URL) {
      setMaterialError("URL and Description are required.");
      return;
    }
    const headers = getAuthHeaders();
    if (!headers) {
      setMaterialError("Authentication required to save material.");
      return;
    }
    setMaterialError(null);
    setLoadingMaterials(true);
    const method = currentMaterial?.ID ? 'PUT' : 'POST';
    const url = currentMaterial?.ID
      ? `${BACKEND_URL}/v1/api/materials/${currentMaterial.ID}`
      : `${BACKEND_URL}/v1/api/materials`;
    const body = JSON.stringify({
      URL: materialURL,
      Description: materialDescription,
      MetaTags: materialMetaTags || ""
    });
    try {
      const response = await fetch(url, { method, headers, body });
      if (!response.ok) throw new Error(await parseError(response));
      handleCloseMaterialModal();
      await fetchMaterials(); // Refresh list
    } catch (e) {
      setMaterialError(e instanceof Error ? e.message : 'Error saving material');
    } finally {
      setLoadingMaterials(false);
    }
  }, [
    BACKEND_URL, 
    getAuthHeaders, 
    parseError, 
    materialURL, 
    materialDescription, 
    materialMetaTags, 
    currentMaterial, 
    fetchMaterials
  ]);

  const handleDeleteMaterial = useCallback(async (id: number) => {
    if (!confirm('Delete material?') || !BACKEND_URL) return;
    const headers = getAuthHeaders(false);
    if (!headers) {
      setMaterialError("Authentication required to delete material.");
      return;
    }
    setLoadingMaterials(true);
    setMaterialError(null);
    try {
      const url = `${BACKEND_URL}/v1/api/materials/${id}`;
      const response = await fetch(url, { method: 'DELETE', headers });
      if (!response.ok && response.status !== 204) throw new Error(await parseError(response));
      await fetchMaterials(); // Refresh list
    } catch (e) {
      setMaterialError(e instanceof Error ? e.message : 'Error deleting material');
    } finally {
      setLoadingMaterials(false);
    }
  }, [BACKEND_URL, getAuthHeaders, parseError, fetchMaterials]);

  // --- Handlers for Material Tags Modal ---
  const fetchMaterialDetailsForModal = useCallback(async (materialId: number) => {
    if (!BACKEND_URL) return;
    const headers = getAuthHeaders(false);
    if (!headers) {
      setMaterialTagsModalError("Authentication required.");
      return;
    }
    setLoadingMaterialTagsModal(true);
    setMaterialTagsModalError(null);
    try {
      const url = `${BACKEND_URL}/v1/api/materials/${materialId}`;
      const response = await fetch(url, { method: 'GET', headers, cache: 'no-store' });
      if (!response.ok) throw new Error(await parseError(response));
      const detailedMaterial: Material = await response.json();
      setMaterialForTags(detailedMaterial);
      const currentTags = detailedMaterial.Tags || [];
      setTagsForCurrentMaterialInModal(currentTags);
      // Use the passed-in 'tags' prop for calculating available tags
      const currentTagIds = new Set(currentTags.map(t => t.ID));
      const available = tags.filter(t => !currentTagIds.has(t.ID));
      setAvailableTagsForModal(available);
    } catch (e) {
      setMaterialTagsModalError(e instanceof Error ? e.message : 'Error fetching material details');
      setTagsForCurrentMaterialInModal([]);
      setAvailableTagsForModal([]);
    } finally {
      setLoadingMaterialTagsModal(false);
    }
  }, [BACKEND_URL, getAuthHeaders, parseError, tags]); // Depends on 'tags' prop

  const handleOpenMaterialTagsModal = useCallback(async (material: Material) => {
    setMaterialForTags(material);
    setIsMaterialTagsModalOpen(true);
    await fetchMaterialDetailsForModal(material.ID);
  }, [fetchMaterialDetailsForModal]);

  const handleCloseMaterialTagsModal = () => {
    setIsMaterialTagsModalOpen(false);
    setMaterialForTags(null);
    setTagsForCurrentMaterialInModal([]);
    setAvailableTagsForModal([]);
    setMaterialTagsModalError(null);
    setLoadingMaterialTagsModal(false);
  };

  const handleAddTagToMaterial = useCallback(async (tagId: number) => {
    if (!materialForTags || !BACKEND_URL) return;
    const headers = getAuthHeaders(false);
    if (!headers) {
      setMaterialTagsModalError("Authentication required.");
      return;
    }
    setLoadingMaterialTagsModal(true);
    setMaterialTagsModalError(null);
    try {
      const url = `${BACKEND_URL}/v1/api/materials/${materialForTags.ID}/tags/${tagId}/add`;
      const response = await fetch(url, { method: 'POST', headers });
      if (!response.ok) throw new Error(await parseError(response));
      await fetchMaterialDetailsForModal(materialForTags.ID); // Refresh modal data
    } catch (e) {
      setMaterialTagsModalError(e instanceof Error ? e.message : 'Error adding tag to material');
    } finally {
      setLoadingMaterialTagsModal(false);
    }
  }, [BACKEND_URL, getAuthHeaders, parseError, materialForTags, fetchMaterialDetailsForModal]);

  const handleRemoveTagFromMaterial = useCallback(async (tagId: number) => {
    if (!materialForTags || !BACKEND_URL) return;
    const headers = getAuthHeaders(false);
    if (!headers) {
      setMaterialTagsModalError("Authentication required.");
      return;
    }
    setLoadingMaterialTagsModal(true);
    setMaterialTagsModalError(null);
    try {
      const url = `${BACKEND_URL}/v1/api/materials/${materialForTags.ID}/tags/${tagId}/remove`;
      const response = await fetch(url, { method: 'POST', headers });
      if (!response.ok) throw new Error(await parseError(response));
      await fetchMaterialDetailsForModal(materialForTags.ID); // Refresh modal data
    } catch (e) {
      setMaterialTagsModalError(e instanceof Error ? e.message : 'Error removing tag from material');
    } finally {
      setLoadingMaterialTagsModal(false);
    }
  }, [BACKEND_URL, getAuthHeaders, parseError, materialForTags, fetchMaterialDetailsForModal]);

  // --- Render Logic ---
  return (
    <section className="bg-white shadow rounded-lg p-4 md:p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Manage Materials</h2>
        <button onClick={() => handleOpenMaterialModal()} className={primaryButtonClass}>Add New Material</button>
      </div>
      {!isMaterialModalOpen && materialError && <ErrorMessage>{materialError}</ErrorMessage>}
      {loadingMaterials && <LoadingIndicator>Loading materials...</LoadingIndicator>}
      {!loadingMaterials && (
        <div className="overflow-x-auto">
          <div className="max-h-[400px] overflow-y-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 sticky top-0 z-10">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">URL</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">MetaTags</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Updated</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {materials.length > 0 ? (
                  materials.map((material) => (
                    <tr key={material.ID} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{material.ID}</td>
                      <td className="px-6 py-4 text-sm text-gray-700 max-w-xs truncate" title={material.URL}>
                        <a href={material.URL} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-900 hover:underline">{material.URL}</a>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700 max-w-xs truncate" title={material.Description}>{material.Description}</td>
                      <td className="px-6 py-4 text-sm text-gray-700 max-w-xs truncate" title={material.MetaTags}>{material.MetaTags || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{new Date(material.CreatedAt).toLocaleString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{new Date(material.UpdatedAt).toLocaleString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <button onClick={() => handleOpenMaterialModal(material)} disabled={loadingMaterials} className={secondaryButtonClass}>Edit</button>
                        <button onClick={() => handleOpenMaterialTagsModal(material)} disabled={loadingMaterials || loadingMaterialTagsModal} className={`${baseButtonClass} bg-cyan-600 text-white hover:bg-cyan-700 focus:ring-cyan-500`}>Manage Tags</button>
                        <button onClick={() => handleDeleteMaterial(material.ID)} disabled={loadingMaterials} className={dangerButtonClass}>Delete</button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <EmptyTableMessage colSpan={7}>No materials found.</EmptyTableMessage>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Material Modal (for CRUD) */}
      {isMaterialModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
          <div className="relative mx-auto p-6 border w-full max-w-lg shadow-lg rounded-md bg-white space-y-4">
            <h2 className="text-lg font-medium leading-6 text-gray-900">
              {currentMaterial?.ID ? 'Edit Material' : 'Create New Material'}
            </h2>
            {materialError && <ErrorMessage>{materialError}</ErrorMessage>} {/* Show error inside modal */}
            <div>
              <label htmlFor="materialURL" className="block text-sm font-medium text-gray-700 mb-1">URL:</label>
              <input id="materialURL" type="url" value={materialURL} onChange={(e) => setMaterialURL(e.target.value)} required className={inputClass} disabled={loadingMaterials} />
            </div>
            <div>
              <label htmlFor="materialDescription" className="block text-sm font-medium text-gray-700 mb-1">Description:</label>
              <textarea id="materialDescription" value={materialDescription} onChange={(e) => setMaterialDescription(e.target.value)} required className={`${inputClass} min-h-[60px]`} disabled={loadingMaterials} />
            </div>
            <div>
              <label htmlFor="materialMetaTags" className="block text-sm font-medium text-gray-700 mb-1">Meta Tags (Optional, Serialized):</label>
              <textarea id="materialMetaTags" value={materialMetaTags} onChange={(e) => setMaterialMetaTags(e.target.value)} className={`${inputClass} min-h-[60px]`} disabled={loadingMaterials} />
              <p className="text-xs text-gray-500 mt-1">Enter serialized meta information (e.g., JSON string).</p>
            </div>
            <div className="flex justify-end space-x-3 pt-2">
              <button onClick={handleCloseMaterialModal} disabled={loadingMaterials} className={secondaryButtonClass}>Cancel</button>
              <button onClick={handleSaveMaterial} disabled={loadingMaterials || !materialURL.trim() || !materialDescription.trim()} className={primaryButtonClass}>
                {loadingMaterials ? 'Saving...' : 'Save Material'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Material Tags Modal (for managing associations) */}
      {isMaterialTagsModalOpen && materialForTags && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
          <div className="relative mx-auto p-6 border w-full max-w-2xl shadow-lg rounded-md bg-white">
            <h2 className="text-lg font-medium leading-6 text-gray-900 mb-4">
              Manage Tags for Material: <span className="font-bold">{materialForTags.ID}</span> ({materialForTags.Description.substring(0, 50)}...)
            </h2>

            {materialTagsModalError && <ErrorMessage>{materialTagsModalError}</ErrorMessage>}
            {loadingMaterialTagsModal && <LoadingIndicator>Loading tags...</LoadingIndicator>}

            {!loadingMaterialTagsModal && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Current Tags */} 
                <div>
                  <h3 className="text-md font-semibold mb-2 text-gray-700">Current Tags</h3>
                  <div className="border rounded-md p-3 min-h-[150px] max-h-60 overflow-y-auto bg-gray-50 space-y-2">
                    {tagsForCurrentMaterialInModal.length > 0 ? (
                      tagsForCurrentMaterialInModal.map(tag => (
                        <div key={tag.ID} className="flex justify-between items-center p-2 bg-white border rounded">
                          <span className="text-sm text-gray-800">{tag.Name}</span>
                          <button
                            onClick={() => handleRemoveTagFromMaterial(tag.ID)}
                            disabled={loadingMaterialTagsModal}
                            className={`${baseButtonClass} bg-red-100 text-red-700 hover:bg-red-200 focus:ring-red-500 text-xs px-2 py-1`}
                          >
                            Remove
                          </button>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500 italic text-center pt-4">No tags currently assigned.</p>
                    )}
                  </div>
                </div>

                {/* Available Tags */} 
                <div>
                  <h3 className="text-md font-semibold mb-2 text-gray-700">Available Tags</h3>
                  <div className="border rounded-md p-3 min-h-[150px] max-h-60 overflow-y-auto bg-gray-50 space-y-2">
                    {availableTagsForModal.length > 0 ? (
                      availableTagsForModal.map(tag => (
                        <div key={tag.ID} className="flex justify-between items-center p-2 bg-white border rounded">
                          <span className="text-sm text-gray-800">{tag.Name}</span>
                          <button
                            onClick={() => handleAddTagToMaterial(tag.ID)}
                            disabled={loadingMaterialTagsModal}
                            className={`${baseButtonClass} bg-green-100 text-green-700 hover:bg-green-200 focus:ring-green-500 text-xs px-2 py-1`}
                          >
                            Add
                          </button>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500 italic text-center pt-4">No more tags available to add.</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-3 pt-4 mt-4 border-t">
              <button onClick={handleCloseMaterialTagsModal} disabled={loadingMaterialTagsModal} className={secondaryButtonClass}>Close</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default MaterialManagement; 