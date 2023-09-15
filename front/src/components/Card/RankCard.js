import React from "react";
import styled from "styled-components";
import Title from "../Text/Title";
import GrayText from "../Text/GrayText";
import Bold from "../Text/Bold";
import Review from "../Text/Regular";

const StyledRankCard = styled.li`
  width:23%;
  height:28vh;
  background:#fff;
  border:2px solid #9CD5C2;
  color: #9CD5C2;
  border-radius:0.6rem;
  font-size:0.6rem;
  padding: 0.5em 0.5rem;

  display:flex;
  flex-direction: column;
  justify-content: space-evenly;
  cursor:pointer;
  }
`;


function RankCard({ children,...props }) {
  return(
    <StyledRankCard {...props}>{children}

      <Title>NickName</Title>
      <Bold >술집 이름</Bold>
      <GrayText >서울시 구로구 부일로1길 </GrayText>
      <Review >저기 사라진 별의 자리 아스라이 하얀 빛 한 동안은 꺼내 볼 수 있을거야. 아낌없이 반짝인 시간은 조금...</Review>
    </StyledRankCard>
  );
}
export default RankCard;
