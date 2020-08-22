import styled from "styled-components";

export const ItemHeader = styled.button`
  display: flex !important;
  height: 60px;
  flex-direction: column !important;
  justify-content: stretch !important;
  align-items: center !important;
  border-radius: 3px;
  border: none;
  background: rgba(255, 255, 255, 0.3);
  padding: 3px 5px;
  width: 100px;
  margin-right: 7px;
  cursor: pointer;
  transition: background 0.6s;

  &:focus {
    outline-style: none;
  }

  &:hover {
    background: rgba(255, 255, 255, 0.18);
  }
`;

export const ContentHeader = styled.div`
  display: flex;
  flex-direction: row;
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  border-bottom: 1px solid lightgray;
  margin-bottom: 10px;
`;

export const DividerStyle = styled.div`
  height: 60px;
  border-right: 1px solid rgba(255, 255, 255, 0.3);
  margin-left: 5px;
  margin-right: 13px;
`;
