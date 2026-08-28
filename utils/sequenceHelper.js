const { supabase, isSupabaseConfigured } = require('../config/supabase');

/**
 * Normalizes sequence numbers for a given table or memory array to be 1..N without duplicates or gaps.
 * @param {string} tableName - Supabase table name
 * @param {Array} memoryList - Fallback memory array reference
 * @param {Object} scope - Optional key-value pair to scope reordering (e.g. { product_category_id: 1 })
 */
async function normalizeSequence(tableName, memoryList = [], scope = null) {
  if (isSupabaseConfigured()) {
    try {
      let query = supabase
        .from(tableName)
        .select('id, sort_order')
        .order('sort_order', { ascending: true })
        .order('updated_at', { ascending: false })
        .order('id', { ascending: true });

      if (scope) {
        Object.entries(scope).forEach(([k, v]) => {
          if (v !== undefined && v !== null) {
            query = query.eq(k, v);
          }
        });
      }

      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        const updates = [];
        data.forEach((item, index) => {
          const desiredOrder = index + 1;
          if (item.sort_order !== desiredOrder) {
            updates.push(
              supabase
                .from(tableName)
                .update({ sort_order: desiredOrder })
                .eq('id', item.id)
            );
          }
        });

        if (updates.length > 0) {
          await Promise.all(updates);
        }
        return;
      }
    } catch (err) {
      console.warn(`[sequenceHelper.normalizeSequence] Supabase failed for table ${tableName}:`, err.message);
    }
  }

  // Memory fallback normalization
  if (Array.isArray(memoryList) && memoryList.length > 0) {
    let targetItems = memoryList;
    if (scope) {
      targetItems = memoryList.filter(item => {
        return Object.entries(scope).every(([k, v]) => item[k] === v);
      });
    }

    targetItems.sort((a, b) => {
      const diff = (a.sort_order || 0) - (b.sort_order || 0);
      if (diff !== 0) return diff;
      return (a.id || 0) - (b.id || 0);
    });

    targetItems.forEach((item, index) => {
      item.sort_order = index + 1;
    });
  }
}

/**
 * Adjusts sequence when a new item is created.
 * Inserts the new item at targetOrder, shifting existing items at or above targetOrder down (+1).
 */
async function adjustSequenceOnCreate(tableName, memoryList, newItemId, targetOrder, scope = null) {
  if (isSupabaseConfigured()) {
    try {
      let query = supabase
        .from(tableName)
        .select('*')
        .order('sort_order', { ascending: true })
        .order('id', { ascending: true });

      if (scope) {
        Object.entries(scope).forEach(([k, v]) => {
          if (v !== undefined && v !== null) {
            query = query.eq(k, v);
          }
        });
      }

      const { data: allItems, error } = await query;
      if (!error && allItems) {
        // Separate new item and existing items
        const newItem = allItems.find(i => String(i.id) === String(newItemId));
        const otherItems = allItems.filter(i => String(i.id) !== String(newItemId));

        let reqOrder = Number(targetOrder);
        if (isNaN(reqOrder) || reqOrder <= 0) {
          reqOrder = otherItems.length + 1;
        }

        const clampedOrder = Math.max(1, Math.min(reqOrder, otherItems.length + 1));
        const targetIndex = clampedOrder - 1;

        if (newItem) {
          otherItems.splice(targetIndex, 0, newItem);
        }

        // Apply new sequence to all items
        const updates = [];
        otherItems.forEach((item, index) => {
          const newOrder = index + 1;
          if (item.sort_order !== newOrder) {
            updates.push(
              supabase
                .from(tableName)
                .update({ sort_order: newOrder })
                .eq('id', item.id)
            );
          }
        });

        if (updates.length > 0) {
          await Promise.all(updates);
        }
        return;
      }
    } catch (err) {
      console.warn(`[sequenceHelper.adjustSequenceOnCreate] Supabase error:`, err.message);
    }
  }

  // Memory fallback
  if (Array.isArray(memoryList)) {
    let targetItems = memoryList;
    if (scope) {
      targetItems = memoryList.filter(item => Object.entries(scope).every(([k, v]) => item[k] === v));
    }

    const newItem = targetItems.find(i => String(i.id) === String(newItemId));
    const otherItems = targetItems.filter(i => String(i.id) !== String(newItemId));

    let reqOrder = Number(targetOrder);
    if (isNaN(reqOrder) || reqOrder <= 0) {
      reqOrder = otherItems.length + 1;
    }

    const clampedOrder = Math.max(1, Math.min(reqOrder, otherItems.length + 1));
    const targetIndex = clampedOrder - 1;

    otherItems.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));

    if (newItem) {
      otherItems.splice(targetIndex, 0, newItem);
    }

    otherItems.forEach((item, index) => {
      item.sort_order = index + 1;
    });
  }
}

/**
 * Adjusts sequence when an existing item's sort_order is updated.
 * Moves the item to targetOrder position and shifts other items accordingly.
 */
async function adjustSequenceOnUpdate(tableName, memoryList, itemId, targetOrder, scope = null) {
  let reqOrder = Number(targetOrder);
  if (isNaN(reqOrder) || reqOrder <= 0) {
    reqOrder = 1;
  }

  if (isSupabaseConfigured()) {
    try {
      let query = supabase
        .from(tableName)
        .select('*')
        .order('sort_order', { ascending: true })
        .order('id', { ascending: true });

      if (scope) {
        Object.entries(scope).forEach(([k, v]) => {
          if (v !== undefined && v !== null) {
            query = query.eq(k, v);
          }
        });
      }

      const { data: allItems, error } = await query;
      if (!error && allItems && allItems.length > 0) {
        const targetItem = allItems.find(i => String(i.id) === String(itemId));
        if (!targetItem) return;

        const otherItems = allItems.filter(i => String(i.id) !== String(itemId));
        const clampedOrder = Math.max(1, Math.min(reqOrder, allItems.length));
        const targetIndex = clampedOrder - 1;

        otherItems.splice(targetIndex, 0, targetItem);

        const updates = [];
        otherItems.forEach((item, index) => {
          const newOrder = index + 1;
          if (item.sort_order !== newOrder) {
            updates.push(
              supabase
                .from(tableName)
                .update({ sort_order: newOrder })
                .eq('id', item.id)
            );
          }
        });

        if (updates.length > 0) {
          await Promise.all(updates);
        }
        return;
      }
    } catch (err) {
      console.warn(`[sequenceHelper.adjustSequenceOnUpdate] Supabase error:`, err.message);
    }
  }

  // Memory fallback
  if (Array.isArray(memoryList)) {
    let targetItems = memoryList;
    if (scope) {
      targetItems = memoryList.filter(item => Object.entries(scope).every(([k, v]) => item[k] === v));
    }

    targetItems.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));

    const targetItem = targetItems.find(i => String(i.id) === String(itemId));
    if (!targetItem) return;

    const otherItems = targetItems.filter(i => String(i.id) !== String(itemId));
    const clampedOrder = Math.max(1, Math.min(reqOrder, targetItems.length));
    const targetIndex = clampedOrder - 1;

    otherItems.splice(targetIndex, 0, targetItem);

    otherItems.forEach((item, index) => {
      item.sort_order = index + 1;
    });
  }
}

/**
 * Adjusts sequence after an item is deleted, filling in gaps.
 */
async function adjustSequenceOnDelete(tableName, memoryList, scope = null) {
  await normalizeSequence(tableName, memoryList, scope);
}

/**
 * Batch reorders items based on an array of ordered item IDs.
 * @param {string} tableName - Supabase table name
 * @param {Array} memoryList - Fallback memory array reference
 * @param {Array<number|string>} orderedIds - Array of item IDs in desired order
 * @param {Object} scope - Optional key-value pair to scope reordering
 */
async function batchReorder(tableName, memoryList, orderedIds, scope = null) {
  if (!Array.isArray(orderedIds) || orderedIds.length === 0) return;

  if (isSupabaseConfigured()) {
    try {
      const updates = orderedIds.map((id, index) => {
        return supabase
          .from(tableName)
          .update({ sort_order: index + 1 })
          .eq('id', id);
      });

      await Promise.all(updates);
      await normalizeSequence(tableName, memoryList, scope);
      return;
    } catch (err) {
      console.warn(`[sequenceHelper.batchReorder] Supabase error:`, err.message);
    }
  }

  // Memory fallback
  if (Array.isArray(memoryList)) {
    const idMap = new Map();
    orderedIds.forEach((id, index) => {
      idMap.set(String(id), index + 1);
    });

    memoryList.forEach(item => {
      const newOrder = idMap.get(String(item.id));
      if (newOrder !== undefined) {
        item.sort_order = newOrder;
      }
    });

    memoryList.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
    await normalizeSequence(tableName, memoryList, scope);
  }
}

module.exports = {
  normalizeSequence,
  adjustSequenceOnCreate,
  adjustSequenceOnUpdate,
  adjustSequenceOnDelete,
  batchReorder,
};
