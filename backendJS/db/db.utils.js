export const sanitizeSingleMongoDocument = (doc) => {
  if (!doc || typeof doc !== "object") {
    return doc;
  }

  if (Array.isArray(doc)) {
    return doc.map((item) => sanitizeSingleMongoDocument(item));
  }

  if (doc.constructor && doc.constructor.name === "ObjectId") {
    return doc.toString();
  }

  if (doc instanceof Date) {
    return doc;
  }

  let plainDoc = doc;
  if (doc.toObject && typeof doc.toObject === "function") {
    plainDoc = doc.toObject();
  }

  const sanitized = { ...plainDoc };

  if (sanitized._id) {
    sanitized.id = sanitized._id.toString();
    delete sanitized._id;
  }

  Object.keys(sanitized).forEach((key) => {
    const value = sanitized[key];

    if (value && typeof value === "object") {
      sanitized[key] = sanitizeSingleMongoDocument(value);
    }
  });

  return sanitized;
};

export const sanitizeMongoData = (data) => {
  if (!data) {
    return data;
  }

  if (Array.isArray(data)) {
    return data.map((doc) => sanitizeSingleMongoDocument(doc));
  }

  return sanitizeSingleMongoDocument(data);
};

export const getSecretRoomId = (participants) => {
  return participants.sort().join("-");
};

export const buildPagination = (totalCount, validatedPage, validatedLimit) => ({
  total: totalCount || 0,
  page: validatedPage || 1,
  limit: validatedLimit || 10,
  totalPages:
    totalCount && validatedLimit ? Math.ceil(totalCount / validatedLimit) : 0,
});
