import styled from 'styled-components';

export const Inputs = styled.span`
  display: flex;
`;

export const SearchBar = styled.input`
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;
  border: 1px solid #989586;
  width: 356px;
  height: 44px;
  padding-left: 12px;
  padding-right: 40px;
  line-height: 22.4px;
  font-size: 16px;
  overflow: scroll;
  outline: none;
`;

export const ClearSearchBar = styled.button`
  height: 30px;
  width: 30px;
  background-color: transparent;
  border: none;
  cursor: pointer;
  padding: 2px;
  display: block;
  margin-top: 9px;
  margin-bottom: 5px;
  position: absolute;
  left: 410px;
`;

export const SearchButton = styled.button`
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
  background-color: rgb(15, 124, 144);
  cursor: pointer;
  height: 48px;
  width: 48px;
  border: 0;
  display: block;
  margin-right: 18px;
`;

export const SearchButtonContainer = styled.div`
  &:hover {
    ${SearchButton} {
      background-color: rgb(9, 76, 89);
    }
  }
`;