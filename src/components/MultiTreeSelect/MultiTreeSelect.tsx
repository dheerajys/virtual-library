/**
 * Multi-tree select component for excluding multiple locations
 */
import React, { useState } from 'react';
import {
  Box,
  Collapse,
  FormControl,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Typography,
  Chip,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  ChevronRight as ChevronRightIcon,
  LocationOn as LocationOnIcon,
  Place as PlaceIcon,
  Room as RoomIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { COLORS } from 'pvs-design-system';
import { ILocationNode } from '../../models/Category';

/**
 * Props for the MultiTreeSelect component
 * Note: Using default parameters in function signature instead of defaultProps (React 18+ best practice)
 */
/* eslint-disable react/require-default-props */
interface IMultiTreeSelectProps {
  data: ILocationNode[];
  selectedIds: string[];
  onSelect: (nodeIds: string[]) => void;
  label?: string;
  helperText?: string;
  error?: boolean;
  disabled?: boolean;
}

interface IMultiTreeNodeProps {
  node: ILocationNode;
  selectedIds: string[];
  onToggle: (nodeId: string) => void;
  level: number;
  disabled?: boolean;
}
/* eslint-enable react/require-default-props */

const MultiTreeNode: React.FC<IMultiTreeNodeProps> = ({
  node,
  selectedIds,
  onToggle,
  level,
  disabled = false,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const hasChildren = node.children && node.children.length > 0;
  const isSelected = selectedIds.includes(node.id);

  const handleExpand = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasChildren) {
      setExpanded(!expanded);
    }
  };

  const handleToggleSelection = () => {
    if (!disabled) {
      onToggle(node.id);
    }
  };

  return (
    <>
      <ListItem
        disablePadding
        sx={{
          pl: level * 2,
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <ListItemButton
          onClick={handleToggleSelection}
          disabled={disabled}
          sx={{
            borderRadius: 1,
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              bgcolor: `rgba(${parseInt(
                COLORS.purple[700].slice(1, 3),
                16
              )}, ${parseInt(COLORS.purple[700].slice(3, 5), 16)}, ${parseInt(
                COLORS.purple[700].slice(5, 7),
                16
              )}, 0.08)`,
              transform: 'translateX(4px)',
            },
          }}
        >
          {hasChildren && (
            <ListItemIcon
              onClick={handleExpand}
              sx={{
                minWidth: 32,
                cursor: 'pointer',
                color: 'text.secondary',
              }}
            >
              {expanded ? <ExpandMoreIcon /> : <ChevronRightIcon />}
            </ListItemIcon>
          )}
          {!hasChildren && <Box sx={{ width: 32 }} />}
          <ListItemIcon sx={{ minWidth: 36 }}>
            {(level === 0 || level === 1) && (
              <LocationOnIcon
                sx={{
                  fontSize: level === 0 ? 24 : 22,
                  color: COLORS.purple[700],
                }}
              />
            )}
            {level === 2 && (
              <PlaceIcon sx={{ fontSize: 20, color: COLORS.purple[700] }} />
            )}
            {level > 2 && (
              <RoomIcon sx={{ fontSize: 18, color: COLORS.purple[700] }} />
            )}
          </ListItemIcon>
          <ListItemText
            primary={node.name}
            primaryTypographyProps={{
              fontWeight: isSelected ? 600 : 400,
              color: isSelected ? 'primary.main' : 'text.primary',
            }}
          />
          {(isSelected || isHovered) && (
            <CheckCircleIcon
              sx={{
                fontSize: 20,
                color: isSelected ? COLORS.purple[700] : 'action.disabled',
                transition: 'all 0.2s ease-in-out',
                opacity: isSelected ? 1 : 0.6,
              }}
            />
          )}
        </ListItemButton>
      </ListItem>
      {hasChildren && (
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {node.children!.map((child) => (
              <MultiTreeNode
                key={child.id}
                node={child}
                selectedIds={selectedIds}
                onToggle={onToggle}
                level={level + 1}
                disabled={disabled}
              />
            ))}
          </List>
        </Collapse>
      )}
    </>
  );
};

/**
 * Multi-tree select component for selecting multiple items from a hierarchy
 * Note: MultiTreeNode helper component is intentionally in the same file for encapsulation
 */
/* eslint-disable-next-line react/no-multi-comp */
export const MultiTreeSelect: React.FC<IMultiTreeSelectProps> = ({
  data,
  selectedIds,
  onSelect,
  label,
  helperText,
  error = false,
  disabled = false,
}) => {
  const handleToggle = (nodeId: string) => {
    if (selectedIds.includes(nodeId)) {
      onSelect(selectedIds.filter((id) => id !== nodeId));
    } else {
      onSelect([...selectedIds, nodeId]);
    }
  };

  const handleRemoveChip = (nodeId: string) => {
    onSelect(selectedIds.filter((id) => id !== nodeId));
  };

  // Helper function to find node name by ID
  const findNodeName = (
    nodeId: string,
    nodes: ILocationNode[]
  ): string | null => {
    const node = nodes.find((n) => n.id === nodeId);
    if (node) return node.name;

    return nodes.reduce<string | null>((found, currentNode) => {
      if (found) return found;
      if (currentNode.children) {
        return findNodeName(nodeId, currentNode.children);
      }
      return null;
    }, null);
  };

  return (
    <FormControl fullWidth error={error} disabled={disabled}>
      {label && (
        <Typography
          variant="body2"
          fontWeight={600}
          gutterBottom
          color={error ? 'error' : 'text.primary'}
        >
          {label}
        </Typography>
      )}

      {helperText && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
          {helperText}
        </Typography>
      )}

      {/* Selected items chips */}
      {selectedIds.length > 0 && (
        <Box sx={{ mb: 1, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {selectedIds.map((id) => (
            <Chip
              key={id}
              label={findNodeName(id, data)}
              onDelete={() => handleRemoveChip(id)}
              color="primary"
              variant="outlined"
              size="small"
            />
          ))}
        </Box>
      )}

      <Paper
        variant="outlined"
        sx={{
          maxHeight: 200,
          overflowY: 'auto',
          p: 1,
          borderColor: error ? 'error.main' : 'divider',
          bgcolor: disabled ? 'action.disabledBackground' : 'background.paper',
          '&:hover': {
            borderColor: error ? 'error.main' : 'primary.main',
          },
        }}
      >
        <List dense>
          {data.map((node) => (
            <MultiTreeNode
              key={node.id}
              node={node}
              selectedIds={selectedIds}
              onToggle={handleToggle}
              level={0}
              disabled={disabled}
            />
          ))}
        </List>
      </Paper>
    </FormControl>
  );
};

export default MultiTreeSelect;
