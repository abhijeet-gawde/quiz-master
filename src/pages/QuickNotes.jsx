import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import KeyboardArrowRightRoundedIcon from '@mui/icons-material/KeyboardArrowRightRounded';
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import { Alert, Button, CircularProgress, Container, IconButton, Paper, Typography } from '@mui/material';
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getQuickNotes } from '../services/quickNotesService';
import { getTopics } from '../services/topicService';

function collectNodeIds(node, ids = []) {
  ids.push(node.id);
  node.children?.forEach((child) => collectNodeIds(child, ids));
  return ids;
}

function getInitialExpandedIds(root) {
  return new Set([root.id]);
}

function getNodePath(root, targetId, path = []) {
  const nextPath = [...path, root.id];
  if (root.id === targetId) return nextPath;
  for (const child of root.children ?? []) {
    const childPath = getNodePath(child, targetId, nextPath);
    if (childPath) return childPath;
  }
  return null;
}

function renderContentBlock(block, key) {
  const data = block.data ?? {};

  switch (block.type) {
    case 'paragraph':
      return <Typography key={key} component="p" className="map-content-paragraph">{data.text}</Typography>;
    case 'heading':
      return <Typography key={key} component="h4" className="map-content-heading">{data.text}</Typography>;
    case 'bulletList':
    case 'orderedList': {
      const List = block.type === 'orderedList' ? 'ol' : 'ul';
      return <List key={key} className="map-content-list">{(data.items ?? []).map((item, index) => <li key={`${index}-${item}`}>{item}</li>)}</List>;
    }
    case 'callout':
      return <aside key={key} className="map-content-callout"><strong>{data.label}</strong><span>{data.text}</span></aside>;
    default:
      return <Typography key={key} component="p" className="map-content-paragraph">{data.text ?? JSON.stringify(data)}</Typography>;
  }
}

function MapNode({ node, parentId, depth, focusedId, expandedIds, detailsExpandedIds, onFocus, onToggle, onToggleDetails, registerNode, labels }) {
  const children = node.children ?? [];
  const hasChildren = children.length > 0;
  const expanded = expandedIds.has(node.id);
  const hasContent = (node.content?.length ?? 0) > 0;
  const detailsExpanded = detailsExpandedIds.has(node.id);

  return (
    <div className={`mind-map-branch ${focusedId === node.id ? 'is-focused' : ''}`}>
      <Paper
        className={`mind-map-card card-${node.cardType || 'term'} ${focusedId === node.id ? 'is-focused' : ''}`}
        elevation={0}
        component="article"
        data-node-id={node.id}
        data-parent-id={parentId ?? ''}
        data-node-depth={depth}
        ref={(element) => registerNode(node.id, element)}
        style={node.color ? { '--node-accent': node.color } : undefined}
      >
        <div className="mind-map-card-header">
          <button className="mind-map-select" type="button" onClick={() => onFocus(node.id)}>
            <span className="mind-map-card-title">{node.title}</span>
            {node.summary && <span className="mind-map-card-summary">{node.summary}</span>}
          </button>
        </div>
        {hasContent && (
          <>
            <div className="mind-map-detail-toggle-row">
              <span aria-hidden="true" />
              <IconButton
                className="mind-map-detail-toggle"
                size="small"
                aria-label={`${detailsExpanded ? labels.collapseDetailsLabel : labels.expandDetailsLabel}: ${node.title}`}
                aria-expanded={detailsExpanded}
                aria-controls={`mind-map-content-${node.id}`}
                onClick={() => onToggleDetails(node.id)}
              >
                <ExpandMoreRoundedIcon className={detailsExpanded ? 'is-open' : ''} fontSize="small" />
              </IconButton>
              <span aria-hidden="true" />
            </div>
            {detailsExpanded && <div className={`mind-map-card-content ${node.cardType === 'term' ? 'content-term' : ''}`} id={`mind-map-content-${node.id}`}>
            {node.content.map((block, index) => renderContentBlock(block, `${node.id}-${index}`))}
            </div>}
          </>
        )}
      </Paper>
      {hasChildren && (
        <IconButton
          className={`mind-map-child-toggle ${expanded ? 'is-open' : ''}`}
          size="small"
          aria-label={`${expanded ? labels.collapseLabel : labels.expandLabel}: ${node.title}`}
          aria-expanded={expanded}
          onClick={() => onToggle(node.id)}
        >
          <KeyboardArrowRightRoundedIcon fontSize="small" />
        </IconButton>
      )}
      {hasChildren && expanded && (
        <div className="mind-map-children" role="group" aria-label={node.title}>
          {children.map((child) => (
            <MapNode
              key={child.id}
              node={child}
              parentId={node.id}
              depth={depth + 1}
              focusedId={focusedId}
              expandedIds={expandedIds}
              detailsExpandedIds={detailsExpandedIds}
              onFocus={onFocus}
              onToggle={onToggle}
              onToggleDetails={onToggleDetails}
              registerNode={registerNode}
              labels={labels}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function QuickNotes() {
  const { topicId } = useParams();
  const notes = getQuickNotes(topicId);
  const [topics, setTopics] = useState([]);
  const [focusedId, setFocusedId] = useState(null);
  const [selectedSectionId, setSelectedSectionId] = useState(null);
  const [expandedIds, setExpandedIds] = useState(() => notes ? getInitialExpandedIds(notes.root) : new Set());
  const [detailsExpandedIds, setDetailsExpandedIds] = useState(() => notes ? new Set([notes.root.id]) : new Set());
  const [loadingTopics, setLoadingTopics] = useState(true);
  const mapViewportRef = useRef(null);
  const mapCanvasRef = useRef(null);
  const connectorLayerRef = useRef(null);
  const nodeElements = useRef(new Map());
  const dragState = useRef(null);
  const visibleNodeIds = useMemo(() => notes ? new Set(collectNodeIds(notes.root)) : new Set(), [notes]);

  useEffect(() => {
    let active = true;
    getTopics().then((result) => {
      if (active) setTopics(result);
    }).finally(() => {
      if (active) setLoadingTopics(false);
    });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (!notes) return;
    setFocusedId(null);
    setExpandedIds(getInitialExpandedIds(notes.root));
    setDetailsExpandedIds(new Set([notes.root.id]));
    nodeElements.current.clear();
  }, [notes]);

  useLayoutEffect(() => {
    if (loadingTopics || !notes) return;
    const viewport = mapViewportRef.current;
    const rootElement = nodeElements.current.get(notes.root.id);
    if (!viewport || !rootElement) return;
    const viewportBounds = viewport.getBoundingClientRect();
    const rootBounds = rootElement.getBoundingClientRect();
    viewport.scrollTop += rootBounds.top - viewportBounds.top + rootBounds.height / 2 - viewport.clientHeight / 2;
  }, [loadingTopics, notes]);

  const topic = topics.find((item) => item.id === topicId);
  const labels = notes?.ui ?? {};

  function drawConnectors() {
    const canvas = mapCanvasRef.current;
    const svg = connectorLayerRef.current;
    if (!canvas || !svg) return;

    const width = Math.max(canvas.scrollWidth, canvas.clientWidth);
    const height = Math.max(canvas.scrollHeight, canvas.clientHeight);
    svg.setAttribute('width', width);
    svg.setAttribute('height', height);
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
    svg.replaceChildren();

    const canvasBounds = canvas.getBoundingClientRect();
    const cards = [...canvas.querySelectorAll('[data-node-id]')];
    const cardsById = new Map(cards.map((card) => [card.dataset.nodeId, card]));
    for (const child of cards) {
      const parent = cardsById.get(child.dataset.parentId);
      if (!parent) continue;

      const parentBounds = parent.getBoundingClientRect();
      const childBounds = child.getBoundingClientRect();
      const startX = parentBounds.right - canvasBounds.left;
      const startY = parentBounds.top + parentBounds.height / 2 - canvasBounds.top;
      const endX = childBounds.left - canvasBounds.left;
      const endY = childBounds.top + childBounds.height / 2 - canvasBounds.top;
      const curve = Math.max(24, Math.min(100, (endX - startX) * 0.48));
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', `M ${startX} ${startY} C ${startX + curve} ${startY}, ${endX - curve} ${endY}, ${endX} ${endY}`);
      path.setAttribute('class', `mind-map-link mind-map-link-depth-${child.dataset.nodeDepth}`);
      svg.append(path);
    }
  }

  useLayoutEffect(() => {
    if (loadingTopics || !notes) return undefined;
    const canvas = mapCanvasRef.current;
    if (!canvas) return undefined;
    const observer = new ResizeObserver(() => requestAnimationFrame(drawConnectors));
    observer.observe(canvas);
    canvas.querySelectorAll('[data-node-id]').forEach((card) => observer.observe(card));
    window.addEventListener('resize', drawConnectors);
    requestAnimationFrame(drawConnectors);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', drawConnectors);
    };
  }, [expandedIds, focusedId, loadingTopics, notes]);

  function focusNode(nodeId) {
    const path = nodeId === notes.root.id ? [] : getNodePath(notes.root, nodeId) ?? [];
    const sectionId = path[1] ?? null;
    setFocusedId(nodeId === notes.root.id ? null : nodeId);
    setSelectedSectionId(sectionId);
    requestAnimationFrame(() => {
      const element = nodeElements.current.get(nodeId);
      element?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    });
  }

  function toggleNode(nodeId) {
    if (expandedIds.has(nodeId) && focusedId && focusedId !== nodeId) {
      const focusedPath = getNodePath(notes.root, focusedId);
      if (focusedPath?.includes(nodeId)) {
        setFocusedId(nodeId);
        setSelectedSectionId(nodeId === notes.root.id ? null : getNodePath(notes.root, nodeId)?.[1] ?? null);
      }
    }
    setExpandedIds((current) => {
      const next = new Set(current);
      if (next.has(nodeId)) next.delete(nodeId);
      else next.add(nodeId);
      return next;
    });
  }

  function toggleDetails(nodeId) {
    setDetailsExpandedIds((current) => {
      const next = new Set(current);
      if (next.has(nodeId)) next.delete(nodeId);
      else next.add(nodeId);
      return next;
    });
  }

  function startPan(event) {
    if (event.pointerType === 'touch' || event.button !== 0 || event.target.closest('button, a, input, textarea, select')) return;
    const viewport = mapViewportRef.current;
    dragState.current = { pointerId: event.pointerId, x: event.clientX, y: event.clientY, left: viewport.scrollLeft, top: viewport.scrollTop };
    viewport.setPointerCapture(event.pointerId);
    viewport.classList.add('is-panning');
  }

  function movePan(event) {
    const drag = dragState.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    const viewport = mapViewportRef.current;
    viewport.scrollLeft = drag.left - (event.clientX - drag.x);
    viewport.scrollTop = drag.top - (event.clientY - drag.y);
  }

  function endPan(event) {
    if (!dragState.current || dragState.current.pointerId !== event.pointerId) return;
    dragState.current = null;
    mapViewportRef.current?.classList.remove('is-panning');
  }

  if (loadingTopics) {
    return <main className="quick-notes-loading"><CircularProgress size={26} /><Typography>{labels.loadingLabel ?? 'Loading quick notes'}</Typography></main>;
  }

  if (!notes || !topic || !notes.root || !visibleNodeIds.has(notes.root.id)) {
    return (
      <Container maxWidth="md" className="quick-notes-error">
        <Alert severity="info" action={<Button component={Link} to="/">{labels.backLabel ?? 'Back to topics'}</Button>}>
          <Typography fontWeight={800}>{labels.unavailableTitle ?? 'Quick Notes unavailable'}</Typography>
          <Typography>{labels.unavailableText ?? 'There are no quick notes for this topic yet.'}</Typography>
        </Alert>
      </Container>
    );
  }

  const mainNodes = notes.root.children ?? [];

  return (
    <main className="quick-notes-page">
      <Container maxWidth="xl" className="quick-notes-shell">
        <header className="quick-notes-header">
          <div>
            <Button component={Link} to="/" startIcon={<ArrowBackRoundedIcon />} className="quick-notes-back">{labels.backLabel ?? 'Back to topics'}</Button>
            <Typography className="eyebrow">{topic.name} · {labels.quickNotesLabel}</Typography>
            <Typography variant="h1" component="h1">{notes.title}</Typography>
            <Typography className="quick-notes-description">{notes.description}</Typography>
          </div>
          <div className="quick-notes-pan-hint"><span aria-hidden="true">✥</span>{labels.panHint}</div>
        </header>

        <section className="quick-notes-workspace" aria-label={labels.mapLabel}>
          <aside className="quick-notes-sidebar">
            <Typography className="sidebar-kicker">{labels.sectionsLabel}</Typography>
            <button className={`sidebar-topic sidebar-root ${selectedSectionId === null ? 'is-selected' : ''}`} type="button" onClick={() => focusNode(notes.root.id)}>
              <span className="sidebar-dot" />
              <span>{labels.rootLabel}</span>
            </button>
            <nav aria-label={labels.rootLabel} className="sidebar-sections">
              {mainNodes.map((node) => (
                <button key={node.id} className={`sidebar-topic ${selectedSectionId === node.id ? 'is-selected' : ''}`} type="button" onClick={() => focusNode(node.id)}>
                  <span className="sidebar-dot" />
                  <span>{node.title}</span>
                  <ChevronRightRoundedIcon fontSize="small" />
                </button>
              ))}
            </nav>
          </aside>

          <section className="quick-notes-map-panel" aria-label={labels.mapLabel}>
            <div className="map-panel-heading">
              <Typography component="h2">{labels.mapLabel}</Typography>
              <span>{labels.panHint}</span>
            </div>
            <div
              className="mind-map-viewport"
              ref={mapViewportRef}
              onPointerDown={startPan}
              onPointerMove={movePan}
              onPointerUp={endPan}
              onPointerCancel={endPan}
              onLostPointerCapture={endPan}
              onDragStart={(event) => event.preventDefault()}
              role="region"
              aria-label={labels.mapLabel}
              tabIndex={0}
            >
              <div className="mind-map-canvas" ref={mapCanvasRef}>
                <svg className="mind-map-connector-layer" ref={connectorLayerRef} aria-hidden="true" />
                <MapNode
                  node={notes.root}
                  parentId={null}
                  depth={0}
                  focusedId={focusedId}
                  expandedIds={expandedIds}
                  detailsExpandedIds={detailsExpandedIds}
                  onFocus={focusNode}
                  onToggle={toggleNode}
                  onToggleDetails={toggleDetails}
                  registerNode={(id, element) => {
                    if (element) nodeElements.current.set(id, element);
                    else nodeElements.current.delete(id);
                  }}
                  labels={labels}
                />
              </div>
            </div>
          </section>
        </section>
      </Container>
    </main>
  );
}