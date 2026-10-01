const quickNotes = import.meta.glob('../data/quick-notes/*.json', {
  eager: true,
  import: 'default'
});

function isQuickNotesDocument(document, topicId) {
  if (!document || document.topicId !== topicId || typeof document.title !== 'string' || typeof document.description !== 'string') return false;
  const requiredUiLabels = ['rootLabel', 'quickNotesLabel', 'sectionsLabel', 'mapLabel', 'panHint', 'expandLabel', 'collapseLabel', 'expandDetailsLabel', 'collapseDetailsLabel', 'loadingLabel', 'unavailableTitle', 'unavailableText', 'backLabel'];
  if (!document.ui || requiredUiLabels.some((label) => typeof document.ui[label] !== 'string')) return false;
  if (!document.root || typeof document.root !== 'object') return false;

  const pendingNodes = [document.root];
  const nodeIds = new Set();
  while (pendingNodes.length > 0) {
    const node = pendingNodes.pop();
    if (!node || typeof node.id !== 'string' || typeof node.title !== 'string' || typeof node.cardType !== 'string' || nodeIds.has(node.id)) return false;
    nodeIds.add(node.id);
    if (node.children !== undefined && !Array.isArray(node.children)) return false;
    if (node.content !== undefined && !Array.isArray(node.content)) return false;
    for (const block of node.content ?? []) {
      if (!block || typeof block.type !== 'string' || !block.data || typeof block.data !== 'object' || Array.isArray(block.data)) return false;
    }
    pendingNodes.push(...(node.children ?? []));
  }
  return true;
}

export function getQuickNotes(topicId) {
  const document = quickNotes[`../data/quick-notes/${topicId}.json`];
  return isQuickNotesDocument(document, topicId) ? document : null;
}

export function hasQuickNotes(topicId) {
  return getQuickNotes(topicId) !== null;
}